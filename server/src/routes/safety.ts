import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const guides = db.prepare('SELECT * FROM safety_guides ORDER BY type DESC').all();
  res.json(guides);
});

export default router;
