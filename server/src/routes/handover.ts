import { Router } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/:lotId', (req, res) => {
  const { lotId } = req.params;

  const lot = db.prepare('SELECT * FROM lots WHERE id = ? OR code = ?').get(lotId, lotId) as any;
  if (!lot) {
    return res.status(404).json({ error: 'Lot not found' });
  }

  const handover = db.prepare(`
    SELECT h.*, 
           l.code as lot_code, l.weight as initial_weight, l.estimated_price,
           m.name as material_name, m.code as material_code,
           c.name as collector_name, c.phone as collector_phone,
           r.facility_name as recycler_facility_name, r.authorization_number as recycler_auth_no
    FROM handover_records h
    JOIN lots l ON h.lot_id = l.id
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON h.collector_id = c.id
    JOIN recyclers r ON h.recycler_id = r.id
    WHERE h.lot_id = ?
  `).get(lot.id);

  res.json({ lot, handover });
});

router.post('/', (req, res) => {
  const {
    lotCodeOrId,
    verifiedWeight,
    ratePerKg,
    recyclerId = 'rec-greencycle-mum',
    paymentMethod = 'UPI',
    notes
  } = req.body;

  if (!lotCodeOrId || !verifiedWeight) {
    return res.status(400).json({ error: 'Lot identifier and verified weight are required' });
  }

  const lot = db.prepare(`
    SELECT l.*, m.benchmark_price, m.name as material_name
    FROM lots l
    JOIN materials m ON l.material_id = m.id
    WHERE l.id = ? OR l.code = ?
  `).get(lotCodeOrId, lotCodeOrId) as any;

  if (!lot) {
    return res.status(404).json({ error: `No lot found matching "${lotCodeOrId}"` });
  }

  // Determine rate
  const finalRate = ratePerKg ? Number(ratePerKg) : (lot.estimated_price / lot.weight);
  const finalPrice = Math.round(Number(verifiedWeight) * finalRate * 100) / 100;
  const handoverId = 'hnd-' + uuidv4();
  const upiRef = 'UPI-' + Math.floor(100000 + Math.random() * 900000) + '-DEMO';

  // Insert handover record
  db.prepare(`
    INSERT INTO handover_records (
      id, lot_id, collector_id, recycler_id, initial_weight,
      verified_weight, final_price, payment_method, payment_reference, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    handoverId, lot.id, lot.collector_id, recyclerId, lot.weight,
    verifiedWeight, finalPrice, paymentMethod, upiRef, notes || 'Physical digital scale verified. Handover confirmed.'
  );

  // Insert transaction
  const txnId = 'txn-' + uuidv4();
  db.prepare(`
    INSERT INTO transactions (
      id, handover_record_id, lot_id, collector_id, recycler_id,
      amount, status, payment_method, reference_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    txnId, handoverId, lot.id, lot.collector_id, recyclerId,
    finalPrice, 'PAID', paymentMethod, upiRef
  );

  // Update lot status and final price
  db.prepare(`
    UPDATE lots
    SET status = 'COMPLETED', final_price = ?, recycler_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(finalPrice, recyclerId, lot.id);

  // Add traceability events
  db.prepare(`
    INSERT INTO traceability_events (
      id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(), lot.id, 'VERIFIED',
    `Handover verified on calibrated scale: ${verifiedWeight} KG (Initial: ${lot.weight} KG)`,
    recyclerId, 'RECYCLER', 19.1120, 73.0180
  );

  db.prepare(`
    INSERT INTO traceability_events (
      id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(), lot.id, 'PAID',
    `Payment ₹${finalPrice} completed via ${paymentMethod} (Ref: ${upiRef})`,
    recyclerId, 'RECYCLER', 19.1120, 73.0180
  );

  const completedRecord = db.prepare(`
    SELECT h.*, l.code as lot_code, l.weight as initial_weight, m.name as material_name,
           c.name as collector_name, r.facility_name as recycler_facility_name,
           t.reference_id, t.status as payment_status
    FROM handover_records h
    JOIN lots l ON h.lot_id = l.id
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON h.collector_id = c.id
    JOIN recyclers r ON h.recycler_id = r.id
    JOIN transactions t ON t.handover_record_id = h.id
    WHERE h.id = ?
  `).get(handoverId);

  res.status(201).json({
    success: true,
    message: 'Handover verified and payment processed successfully',
    data: completedRecord
  });
});

export default router;
