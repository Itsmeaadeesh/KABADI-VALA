import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const prices = db.prepare(`
    SELECT p.*, m.name, m.name_hi, m.name_mr, m.code, m.unit, m.category
    FROM prices p
    JOIN materials m ON p.material_id = m.id
    ORDER BY p.benchmark_rate DESC
  `).all();
  res.json(prices);
});

router.get('/history', (req, res) => {
  const { materialId, days = 30 } = req.query;
  let query = `
    SELECT ph.date, ph.rate, ph.material_id, m.name, m.code
    FROM price_history ph
    JOIN materials m ON ph.material_id = m.id
  `;
  const params: any[] = [];

  if (materialId) {
    query += ` WHERE ph.material_id = ? OR m.code = ?`;
    params.push(materialId, materialId);
  }

  query += ` ORDER BY ph.date ASC`;

  const history = db.prepare(query).all(...params);

  // Group by date for multi-line charts
  const dateMap = new Map<string, any>();
  for (const h of history as any[]) {
    if (!dateMap.has(h.date)) {
      dateMap.set(h.date, { date: h.date });
    }
    const item = dateMap.get(h.date);
    item[h.code] = h.rate;
  }

  res.json({
    raw: history,
    chartData: Array.from(dateMap.values()).slice(-Number(days))
  });
});

router.put('/:materialId', (req, res) => {
  const { benchmarkRate } = req.body;
  const { materialId } = req.params;

  if (!benchmarkRate || isNaN(Number(benchmarkRate))) {
    return res.status(400).json({ error: 'Valid benchmark rate is required' });
  }

  // Calculate 30-day average for anomaly detection
  const avgStats = db.prepare(`
    SELECT AVG(rate) as meanRate, MAX(rate) as maxRate
    FROM price_history
    WHERE material_id = ? OR material_id = (SELECT id FROM materials WHERE code = ?)
  `).get(materialId, materialId) as any;

  let anomalyWarning: string | null = null;
  if (avgStats && avgStats.meanRate) {
    const deviation = ((Number(benchmarkRate) - avgStats.meanRate) / avgStats.meanRate) * 100;
    if (deviation > 25) {
      anomalyWarning = `Unusual Price Detected: Quoted rate is ${deviation.toFixed(1)}% above the 30-day average.`;
    }
  }

  // Update prices table
  db.prepare(`
    UPDATE prices
    SET benchmark_rate = ?, updated_at = CURRENT_TIMESTAMP
    WHERE material_id = ? OR material_id = (SELECT id FROM materials WHERE code = ?)
  `).run(benchmarkRate, materialId, materialId);

  res.json({
    success: true,
    materialId,
    newRate: benchmarkRate,
    anomalyWarning
  });
});

export default router;
