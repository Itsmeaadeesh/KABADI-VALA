import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import materialsRoutes from './routes/materials.js';
import pricesRoutes from './routes/prices.js';
import lotsRoutes from './routes/lots.js';
import recyclersRoutes from './routes/recyclers.js';
import pickupsRoutes from './routes/pickups.js';
import handoverRoutes from './routes/handover.js';
import transactionsRoutes from './routes/transactions.js';
import analyticsRoutes from './routes/analytics.js';
import safetyRoutes from './routes/safety.js';
import syncRoutes from './routes/sync.js';
import { initDatabase } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB schema
initDatabase();

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/lots', lotsRoutes);
app.use('/api/recyclers', recyclersRoutes);
app.use('/api/pickups', pickupsRoutes);
app.use('/api/handover', handoverRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/sync', syncRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Kabadiwala Connect API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    hackathon: 'SIH 2026 - Problem Statement 26229'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kabadiwala Connect Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
