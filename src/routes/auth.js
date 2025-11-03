const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, init, nextId } = require('../db');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

// ensure db is initialized
init();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    await db.read();
    const existing = db.data.users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const id = nextId('user');
    const user = { id, name, email, passwordHash, created_at: new Date().toISOString() };
    db.data.users.push(user);
    await db.write();
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, SECRET, { expiresIn: '30d' });
    res.json({ user: payload, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, SECRET, { expiresIn: '30d' });
    res.json({ user: payload, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
