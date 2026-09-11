import { Router } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/batch', (req, res) => {
  const { mutations } = req.body;

  if (!Array.isArray(mutations)) {
    return res.status(400).json({ error: 'Mutations array is required' });
  }

  const results: any[] = [];
  let syncedCount = 0;

  const insertLotStmt = db.prepare(`
    INSERT OR IGNORE INTO lots (
      id, code, collector_id, material_id, weight, condition,
      estimated_price, photo_url, ai_predicted_category, ai_confidence,
      status, recycler_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEventStmt = db.prepare(`
    INSERT INTO traceability_events (
      id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of mutations) {
    try {
      if (item.action === 'CREATE_LOT') {
        const payload = item.payload;
        const lotId = payload.id || 'lot-' + uuidv4();
        const lotCode = payload.code || `LOT-2026-MH-${Math.floor(1000 + Math.random() * 9000)}`;

        insertLotStmt.run(
          lotId, lotCode, payload.collectorId || 'col-ramesh-1',
          payload.materialId, payload.weight, payload.condition || 'INTACT',
          payload.estimatedPrice, payload.photoUrl, payload.aiPredictedCategory,
          payload.aiConfidence || 0.94, 'NEW', payload.recyclerId || null
        );

        insertEventStmt.run(
          uuidv4(), lotId, 'CREATED_OFFLINE_SYNC',
          `Lot ${lotCode} synchronized from offline IndexedDB storage (${payload.weight} KG)`,
          payload.collectorId || 'col-ramesh-1', 'COLLECTOR', 19.0434, 72.8550
        );

        results.push({ id: item.id, status: 'SYNCED', lotId, lotCode });
        syncedCount++;
      } else if (item.action === 'REQUEST_PICKUP') {
        const payload = item.payload;
        const pickupId = 'pkp-' + uuidv4();
        db.prepare(`
          INSERT INTO pickup_requests (id, lot_id, collector_id, recycler_id, requested_date, scheduled_time_slot, status, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(pickupId, payload.lotId, payload.collectorId, payload.recyclerId, payload.requestedDate, 'Morning', 'SCHEDULED', payload.notes);

        db.prepare('UPDATE lots SET status = "PICKUP_SCHEDULED", recycler_id = ? WHERE id = ?')
          .run(payload.recyclerId, payload.lotId);

        results.push({ id: item.id, status: 'SYNCED', pickupId });
        syncedCount++;
      }
    } catch (err: any) {
      console.error('Failed to sync mutation:', item, err);
      results.push({ id: item.id, status: 'ERROR', message: err.message });
    }
  }

  res.json({
    success: true,
    syncedCount,
    totalReceived: mutations.length,
    results
  });
});

export default router;
