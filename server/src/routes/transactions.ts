import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const transactions = db.prepare(`
    SELECT t.*, 
           l.code as lot_code, l.weight,
           m.name as material_name, m.code as material_code, m.icon as material_icon,
           c.name as collector_name, c.phone as collector_phone,
           r.facility_name as recycler_facility_name
    FROM transactions t
    JOIN lots l ON t.lot_id = l.id
    JOIN materials m ON l.material_id = m.id
    JOIN collectors c ON t.collector_id = c.id
    JOIN recyclers r ON t.recycler_id = r.id
    ORDER BY t.created_at DESC
  `).all();
  res.json(transactions);
});

router.get('/collector/:collectorId', (req, res) => {
  const { collectorId } = req.params;

  // Paid transactions
  const txns = db.prepare(`
    SELECT t.*, 
           l.code as lot_code, l.weight,
           m.name as material_name, m.name_hi as material_name_hi, m.name_mr as material_name_mr,
           m.code as material_code, m.icon as material_icon,
           r.facility_name as recycler_facility_name
    FROM transactions t
    JOIN lots l ON t.lot_id = l.id
    JOIN materials m ON l.material_id = m.id
    JOIN recyclers r ON t.recycler_id = r.id
    WHERE t.collector_id = ?
    ORDER BY t.created_at DESC
  `).all(collectorId) as any[];

  // Pending lots
  const pendingLots = db.prepare(`
    SELECT SUM(estimated_price) as pending_total, COUNT(*) as pending_count
    FROM lots
    WHERE collector_id = ? AND status != 'COMPLETED' AND status != 'CANCELLED'
  `).get(collectorId) as any;

  // In transit lots
  const inTransitCount = db.prepare(`
    SELECT COUNT(*) as in_transit_count
    FROM lots
    WHERE collector_id = ? AND status IN ('PICKUP_SCHEDULED', 'PICKED_UP', 'AT_RECYCLER')
  `).get(collectorId) as any;

  // Monthly earnings (sum of amounts in 2026-09)
  const monthlyTotal = txns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const completedCount = txns.length;

  res.json({
    summary: {
      thisMonthEarnings: monthlyTotal,
      pendingAmount: pendingLots?.pending_total || 0,
      completedLotsCount: completedCount,
      inTransitCount: inTransitCount?.in_transit_count || 0
    },
    transactions: txns
  });
});

export default router;
