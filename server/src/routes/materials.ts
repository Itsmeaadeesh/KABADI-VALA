import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const materials = db.prepare(`
    SELECT m.*, p.benchmark_rate, p.trend_direction, p.trend_percentage
    FROM materials m
    LEFT JOIN prices p ON m.id = p.material_id
    ORDER BY m.benchmark_price DESC
  `).all() as any[];

  const parsed = materials.map(m => ({
    ...m,
    criticalMinerals: JSON.parse(m.critical_minerals || '[]')
  }));

  res.json(parsed);
});

router.get('/:id', (req, res) => {
  const material = db.prepare(`
    SELECT m.*, p.benchmark_rate, p.trend_direction, p.trend_percentage
    FROM materials m
    LEFT JOIN prices p ON m.id = p.material_id
    WHERE m.id = ? OR m.code = ?
  `).get(req.params.id, req.params.id) as any;

  if (!material) {
    return res.status(404).json({ error: 'Material not found' });
  }

  material.criticalMinerals = JSON.parse(material.critical_minerals || '[]');
  res.json(material);
});

export default router;
