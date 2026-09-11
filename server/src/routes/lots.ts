import { Router } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  const { collectorId, recyclerId, status } = req.query;

  let query = `
    SELECT l.*, 
           m.name as material_name, m.name_hi as material_name_hi, m.name_mr as material_name_mr,
           m.code as material_code, m.benchmark_price, m.unit, m.icon as material_icon,
           c.name as collector_name, c.phone as collector_phone, c.location_name as collector_location,
           r.facility_name as recycler_facility_name, r.contact_phone as recycler_phone
    FROM lots l
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON l.collector_id = c.id
    LEFT JOIN recyclers r ON l.recycler_id = r.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (collectorId) {
    query += ` AND l.collector_id = ?`;
    params.push(collectorId);
  }
  if (recyclerId) {
    query += ` AND (l.recycler_id = ? OR l.recycler_id IS NULL)`;
    params.push(recyclerId);
  }
  if (status) {
    query += ` AND l.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY l.created_at DESC`;

  const lots = db.prepare(query).all(...params);
  res.json(lots);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const lot = db.prepare(`
    SELECT l.*, 
           m.name as material_name, m.name_hi as material_name_hi, m.name_mr as material_name_mr,
           m.code as material_code, m.benchmark_price, m.unit, m.critical_minerals, m.hazards,
           c.name as collector_name, c.phone as collector_phone, c.location_name as collector_location,
           r.facility_name as recycler_facility_name, r.contact_phone as recycler_phone,
           r.authorization_number as recycler_auth_no
    FROM lots l
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON l.collector_id = c.id
    LEFT JOIN recyclers r ON l.recycler_id = r.id
    WHERE l.id = ? OR l.code = ?
  `).get(id, id) as any;

  if (!lot) {
    return res.status(404).json({ error: 'Lot not found' });
  }

  lot.criticalMinerals = JSON.parse(lot.critical_minerals || '[]');

  const timeline = db.prepare(`
    SELECT * FROM traceability_events
    WHERE lot_id = ?
    ORDER BY timestamp ASC
  `).all(lot.id);

  const handover = db.prepare(`
    SELECT * FROM handover_records
    WHERE lot_id = ?
  `).get(lot.id);

  res.json({
    ...lot,
    timeline,
    handover
  });
});

router.post('/', (req, res) => {
  const {
    collectorId = 'col-ramesh-1',
    materialId,
    weight,
    condition = 'INTACT',
    photoUrl,
    aiPredictedCategory,
    aiConfidence,
    recyclerId
  } = req.body;

  if (!materialId || !weight) {
    return res.status(400).json({ error: 'Material and weight are required' });
  }

  // Fetch material benchmark rate
  const material = db.prepare('SELECT * FROM materials WHERE id = ? OR code = ?').get(materialId, materialId) as any;
  if (!material) {
    return res.status(404).json({ error: 'Invalid material' });
  }

  // Calculate rate (check if recycler offers custom rate)
  let ratePerKg = material.benchmark_price;
  if (recyclerId) {
    const recycler = db.prepare('SELECT rates FROM recyclers WHERE id = ?').get(recyclerId) as any;
    if (recycler && recycler.rates) {
      const parsedRates = JSON.parse(recycler.rates);
      if (parsedRates[material.id] || parsedRates[material.code]) {
        ratePerKg = parsedRates[material.id] || parsedRates[material.code];
      }
    }
  }

  // Condition adjustment (+5% for intact, -15% for stripped)
  let multiplier = 1.0;
  if (condition === 'INTACT') multiplier = 1.05;
  else if (condition === 'STRIPPED') multiplier = 0.85;

  const estimatedPrice = Math.round(Number(weight) * ratePerKg * multiplier * 100) / 100;

  const lotId = 'lot-' + uuidv4();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const lotCode = `LOT-2026-MH-${randomSuffix}`;

  db.prepare(`
    INSERT INTO lots (
      id, code, collector_id, material_id, weight, condition,
      estimated_price, photo_url, ai_predicted_category, ai_confidence,
      status, recycler_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lotId, lotCode, collectorId, material.id, weight, condition,
    estimatedPrice, photoUrl || material.sample_image,
    aiPredictedCategory || material.name, aiConfidence || 0.94,
    'NEW', recyclerId || null
  );

  // Add traceability event
  db.prepare(`
    INSERT INTO traceability_events (
      id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(), lotId, 'CREATED',
    `Lot ${lotCode} created: ${weight} KG ${material.name} (Estimated: ₹${estimatedPrice})`,
    collectorId, 'COLLECTOR', 19.0434, 72.8550
  );

  const createdLot = db.prepare('SELECT * FROM lots WHERE id = ?').get(lotId);
  res.status(201).json(createdLot);
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, actorId = 'system', actorRole = 'SYSTEM', recyclerId, notes } = req.body;

  const lot = db.prepare('SELECT * FROM lots WHERE id = ? OR code = ?').get(id, id) as any;
  if (!lot) {
    return res.status(404).json({ error: 'Lot not found' });
  }

  db.prepare(`
    UPDATE lots
    SET status = ?, recycler_id = COALESCE(?, recycler_id), updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, recyclerId || null, lot.id);

  // Append traceability event
  db.prepare(`
    INSERT INTO traceability_events (
      id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(), lot.id, status,
    notes || `Lot status updated to ${status}`,
    actorId, actorRole, 19.1120, 73.0180
  );

  res.json({ success: true, lotId: lot.id, status });
});

export default router;
