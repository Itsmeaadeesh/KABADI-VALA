import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

const handler = (_req: any, res: any) => {
  // 1. Core KPIs
  const collectorsCount = (db.prepare('SELECT COUNT(*) as count FROM collectors').get() as any)?.count || 1248;
  const verifiedTxns = db.prepare('SELECT COUNT(*) as count, SUM(amount) as totalVal FROM transactions').get() as any;
  const lotsStats = db.prepare('SELECT COUNT(*) as count, SUM(weight) as totalWeightKg FROM lots').get() as any;

  // Real-world baseline for national demo
  const divertedTonnes = Math.round(((lotsStats?.totalWeightKg || 51.5) / 1000 + 428.6) * 10) / 10;
  const totalPurchaseValueLakhs = Math.round(((verifiedTxns?.totalVal || 5185) / 100000 + 4.7) * 10) / 10;
  const totalTransactionsCount = (verifiedTxns?.count || 1) + 8420;

  // 2. Critical Mineral Recovery (Calculated from material composition yields)
  // Demo estimates scaled with diverted tonnage
  const scale = divertedTonnes / 428.6;
  const criticalMinerals = [
    { mineral: 'Copper (Cu)', symbol: 'Cu', amount: Math.round(92.4 * scale * 10) / 10, unit: 'tonnes', strategicGrade: 'Strategic Base Metal', color: '#ea580c' },
    { mineral: 'Lithium (Li)', symbol: 'Li', amount: Math.round(4.8 * scale * 10) / 10, unit: 'tonnes', strategicGrade: 'Critical Energy Metal', color: '#9333ea' },
    { mineral: 'Cobalt (Co)', symbol: 'Co', amount: Math.round(1.7 * scale * 10) / 10, unit: 'tonnes', strategicGrade: 'Critical Energy Metal', color: '#2563eb' },
    { mineral: 'Neodymium (Nd)', symbol: 'Nd', amount: Math.round(820 * scale), unit: 'kg', strategicGrade: 'Rare Earth Element', color: '#059669' },
    { mineral: 'Gold (Au)', symbol: 'Au', amount: Math.round(21.4 * scale * 10) / 10, unit: 'kg', strategicGrade: 'Precious Metal', color: '#d97706' },
    { mineral: 'Tantalum (Ta)', symbol: 'Ta', amount: Math.round(340 * scale), unit: 'kg', strategicGrade: 'Critical Technology Metal', color: '#0891b2' },
    { mineral: 'Indium (In)', symbol: 'In', amount: Math.round(95 * scale), unit: 'kg', strategicGrade: 'Critical Display Metal', color: '#4f46e5' },
  ];

  // 3. Regional Heatmap / Flow Data (Maharashtra districts and national hubs)
  const regionalData = [
    { region: 'Mumbai MMR', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, volumeTonnes: 142.5, collectors: 412, recyclersCount: 2, formalizationRate: 78 },
    { region: 'Pune & PCMC', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, volumeTonnes: 98.2, collectors: 285, recyclersCount: 1, formalizationRate: 72 },
    { region: 'Nagpur (JNARDDC Hub)', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, volumeTonnes: 64.1, collectors: 190, recyclersCount: 1, formalizationRate: 85 },
    { region: 'Nashik Industrial', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, volumeTonnes: 38.6, collectors: 110, recyclersCount: 1, formalizationRate: 64 },
    { region: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, volumeTonnes: 26.4, collectors: 84, recyclersCount: 1, formalizationRate: 59 },
    { region: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, volumeTonnes: 34.2, collectors: 95, recyclersCount: 1, formalizationRate: 68 },
    { region: 'Bengaluru Tech Hub', state: 'Karnataka', lat: 12.9716, lng: 77.5946, volumeTonnes: 16.8, collectors: 42, recyclersCount: 1, formalizationRate: 88 },
    { region: 'Hyderabad Deccan', state: 'Telangana', lat: 17.3850, lng: 78.4867, volumeTonnes: 11.4, collectors: 30, recyclersCount: 1, formalizationRate: 74 },
  ];

  // 4. Material Flow Breakdown
  const materialBreakdown = [
    { name: 'Copper Cables', value: 34, color: '#f97316' },
    { name: 'Motherboards / PCBs', value: 28, color: '#16a34a' },
    { name: 'Li-ion Batteries', value: 16, color: '#9333ea' },
    { name: 'Motors & Alternators', value: 12, color: '#0284c7' },
    { name: 'Others (LCD/Magnets)', value: 10, color: '#64748b' },
  ];

  // 5. Monthly Trend
  const monthlyTrends = [
    { month: 'Apr 2026', diverted: 48, value: 4.8 },
    { month: 'May 2026', diverted: 56, value: 5.9 },
    { month: 'Jun 2026', diverted: 68, value: 7.2 },
    { month: 'Jul 2026', diverted: 79, value: 8.4 },
    { month: 'Aug 2026', diverted: 92, value: 10.1 },
    { month: 'Sep 2026', diverted: 85.6, value: 9.8 }
  ];

  res.json({
    kpis: {
      collectorsFormalized: collectorsCount + 1247,
      eWasteDivertedTonnes: divertedTonnes,
      verifiedTransactions: totalTransactionsCount,
      purchaseValueLakhs: totalPurchaseValueLakhs,
      authorizedRecyclersActive: 8
    },
    criticalMinerals,
    regionalData,
    materialBreakdown,
    monthlyTrends,
    disclaimer: 'ESTIMATED / DEMO ANALYTICS: Mineral yields calculated based on JNARDDC baseline recovery models.'
  });
};

router.get('/', handler);
router.get('/overview', handler);

export default router;
