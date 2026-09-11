import { Router } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  const { recyclerId, collectorId } = req.query;
  let query = `
    SELECT p.*, l.code as lot_code, l.weight, l.condition, l.estimated_price,
           m.name as material_name, m.icon as material_icon,
           c.name as collector_name, c.phone as collector_phone, c.location_name as collector_location,
           r.facility_name as recycler_facility_name
    FROM pickup_requests p
    JOIN lots l ON p.lot_id = l.id
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON p.collector_id = c.id
    JOIN recyclers r ON p.recycler_id = r.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (recyclerId) {
    query += ` AND p.recycler_id = ?`;
    params.push(recyclerId);
  }
  if (collectorId) {
    query += ` AND p.collector_id = ?`;
    params.push(collectorId);
  }

  query += ` ORDER BY p.created_at DESC`;
  const pickups = db.prepare(query).all(...params);
  res.json(pickups);
});

router.post('/', (req, res) => {
  const { lotId, collectorId = 'col-ramesh-1', recyclerId, requestedDate, scheduledTimeSlot = 'Morning (10 AM - 1 PM)', notes } = req.body;

  if (!lotId || !recyclerId) {
    return res.status(400).json({ error: 'lotId and recyclerId are required' });
  }

  const pickupId = 'pkp-' + uuidv4();
  const dateStr = requestedDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO pickup_requests (
      id, lot_id, collector_id, recycler_id, requested_date, scheduled_time_slot, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(pickupId, lotId, collectorId, recyclerId, dateStr, scheduledTimeSlot, 'SCHEDULED', notes || 'Doorstep e-waste pickup requested');

  // Update lot status
  db.prepare(`
    UPDATE lots
    SET status = 'PICKUP_SCHEDULED', recycler_id = ?, pickup_request_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(recyclerId, pickupId, lotId);

  // Add traceability event
  db.prepare(`
    INSERT INTO traceability_events (id, lot_id, event_type, description, actor_id, actor_role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), lotId, 'PICKUP_SCHEDULED', `Pickup scheduled with recycler for ${dateStr} (${scheduledTimeSlot})`, collectorId, 'COLLECTOR');

  const created = db.prepare('SELECT * FROM pickup_requests WHERE id = ?').get(pickupId);
  res.status(201).json(created);
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, actorId = 'system', notes } = req.body;

  const pickup = db.prepare('SELECT * FROM pickup_requests WHERE id = ?').get(id) as any;
  if (!pickup) {
    return res.status(404).json({ error: 'Pickup not found' });
  }

  db.prepare('UPDATE pickup_requests SET status = ? WHERE id = ?').run(status, id);

  // Sync lot status
  let lotStatus = 'PICKUP_SCHEDULED';
  if (status === 'PICKED_UP') lotStatus = 'PICKED_UP';
  else if (status === 'COMPLETED') lotStatus = 'COMPLETED';
  else if (status === 'CANCELLED') lotStatus = 'NEW';

  db.prepare('UPDATE lots SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(lotStatus, pickup.lot_id);

  db.prepare(`
    INSERT INTO traceability_events (id, lot_id, event_type, description, actor_id, actor_role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), pickup.lot_id, status, notes || `Pickup status changed to ${status}`, actorId, 'RECYCLER');

  res.json({ success: true, pickupId: id, status });
});

export default router;
