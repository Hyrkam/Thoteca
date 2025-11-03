const express = require('express');
const { db, init, nextId } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

init();

// List books with optional search & genre
router.get('/', async (req, res) => {
  const { q, genre } = req.query;
  try {
    await db.read();
    let list = db.data.books || [];
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(b => (b.title + ' ' + (b.author || '') + ' ' + (b.genre || '')).toLowerCase().includes(ql));
    }
    if (genre) {
      list = list.filter(b => b.genre === genre);
    }
    list = list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    res.json(list.map(({ id, title, author, year, genre, cover, views, owner_id }) => ({ id, title, author, year, genre, cover, views, owner_id })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single book and increment views
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    await db.read();
    const book = db.data.books.find(b => b.id === id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    book.views = (book.views || 0) + 1;
    await db.write();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create book (auth required)
router.post('/', auth, async (req, res) => {
  const { title, author, year, genre, cover, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });
  try {
    await db.read();
    const id = nextId('book');
    const book = { id, title, author: author || null, year: year || null, genre: genre || null, cover: cover || null, content, views: 0, owner_id: req.user.id, created_at: new Date().toISOString() };
    db.data.books.push(book);
    await db.write();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ranking by views
router.get('/ranking/top', async (req, res) => {
  try {
    await db.read();
    const rows = (db.data.books || []).slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 20).map(b => ({ id: b.id, title: b.title, author: b.author, views: b.views || 0 }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
