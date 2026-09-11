import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Haversine distance calculation in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

router.get('/', (_req, res) => {
  const recyclers = db.prepare('SELECT * FROM recyclers ORDER BY rating DESC').all() as any[];
  const parsed = recyclers.map(r => ({
    ...r,
    materialsAccepted: JSON.parse(r.materials_accepted || '[]'),
    rates: JSON.parse(r.rates || '{}')
  }));
  res.json(parsed);
});

router.get('/nearby', (req, res) => {
  const { lat = 19.0434, lng = 72.8550, materialCode, maxDistance = 50 } = req.query;
  const userLat = Number(lat);
  const userLng = Number(lng);
  const matCode = typeof materialCode === 'string' ? materialCode : undefined;

  const recyclers = db.prepare('SELECT * FROM recyclers').all() as any[];

  const scoredRecyclers = recyclers.map(r => {
    const materialsAccepted = JSON.parse(r.materials_accepted || '[]');
    const rates = JSON.parse(r.rates || '{}');
    const distance = calculateDistance(userLat, userLng, r.latitude, r.longitude);

    // 5-Factor Smart Matching Algorithm
    // 1. Authorization status (30%)
    let authScore = 0;
    if (r.authorization_status === 'AUTHORIZED') authScore = 30;
    else if (r.authorization_status === 'PENDING') authScore = 15;

    // 2. Material compatibility (25%)
    let materialScore = 10;
    if (matCode) {
      materialScore = materialsAccepted.includes(matCode) ? 25 : 0;
    } else {
      materialScore = 20;
    }

    // 3. Offered rate relative to benchmark (20%)
    let rateScore = 15;
    if (matCode && rates[matCode]) {
      rateScore = 20;
    }

    // 4. Distance proximity (15%)
    let distanceScore = Math.max(0, 15 - (distance / 5));

    // 5. Pickup availability (10%)
    let pickupScore = r.pickup_available === 1 ? 10 : 3;

    const totalScore = Math.round((authScore + materialScore + rateScore + distanceScore + pickupScore) * 10) / 10;

    return {
      ...r,
      materialsAccepted,
      rates,
      distanceKm: distance,
      matchScore: totalScore,
      isWithinService: distance <= r.service_radius
    };
  });

  // Filter within maxDistance
  const filtered = scoredRecyclers
    .filter(r => r.distanceKm <= Number(maxDistance))
    .sort((a, b) => b.matchScore - a.matchScore);

  if (filtered.length > 0) {
    (filtered[0] as any).isBestMatch = true;
  }

  res.json(filtered);
});

router.put('/:id/rates', (req, res) => {
  const { id } = req.params;
  const { rates } = req.body;

  if (!rates || typeof rates !== 'object') {
    return res.status(400).json({ error: 'Valid rates object is required' });
  }

  db.prepare(`
    UPDATE recyclers
    SET rates = ?
    WHERE id = ?
  `).run(JSON.stringify(rates), id);

  res.json({ success: true, recyclerId: id, rates });
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['AUTHORIZED', 'PENDING', 'SUSPENDED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid authorization status' });
  }

  db.prepare(`
    UPDATE recyclers
    SET authorization_status = ?
    WHERE id = ?
  `).run(status, id);

  res.json({ success: true, recyclerId: id, status });
});

export default router;
