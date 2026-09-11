import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Demo users map
const DEMO_PHONE_MAP: Record<string, { role: string; name: string }> = {
  '9999999999': { role: 'COLLECTOR', name: 'Ramesh Kumar (कबाड़ीवाला)' },
  '8888888888': { role: 'RECYCLER', name: 'Rajesh Sharma (GreenCycle Facility)' },
  '7777777777': { role: 'ADMIN', name: 'Dr. S. K. Verma (JNARDDC / MoM Admin)' },
};

router.post('/login', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Find user by phone
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any;

  if (!user) {
    const demoInfo = DEMO_PHONE_MAP[phone] || { role: 'COLLECTOR', name: 'Demo User (' + phone.slice(-4) + ')' };
    const newUserId = 'usr-' + Date.now();
    db.prepare('INSERT INTO users (id, phone, name, role, language) VALUES (?, ?, ?, ?, ?)')
      .run(newUserId, phone, demoInfo.name, demoInfo.role, 'hi');
    user = { id: newUserId, phone, name: demoInfo.name, role: demoInfo.role, language: 'hi' };
  }

  return res.json({
    message: 'OTP sent successfully (Demo OTP: 123456)',
    phone,
    demoOtp: '123456'
  });
});

router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  if (otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP. For demo mode, please enter 123456' });
  }

  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any;
  if (!user) {
    const demoInfo = DEMO_PHONE_MAP[phone] || { role: 'COLLECTOR', name: 'Collector (' + phone.slice(-4) + ')' };
    const newUserId = 'usr-' + Date.now();
    db.prepare('INSERT INTO users (id, phone, name, role, language) VALUES (?, ?, ?, ?, ?)')
      .run(newUserId, phone, demoInfo.name, demoInfo.role, 'hi');
    user = { id: newUserId, phone, name: demoInfo.name, role: demoInfo.role, language: 'hi' };
  }

  let profile = null;
  if (user.role === 'COLLECTOR') {
    profile = db.prepare('SELECT * FROM collectors WHERE user_id = ?').get(user.id);
  } else if (user.role === 'RECYCLER') {
    profile = db.prepare('SELECT * FROM recyclers WHERE user_id = ?').get(user.id);
  }

  return res.json({
    user,
    profile,
    token: 'mock-jwt-token-' + user.id + '-' + Date.now()
  });
});

export default router;
