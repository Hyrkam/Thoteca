const fs = require('fs').promises;
const path = require('path');

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'db.json');
const dir = path.dirname(dbFile);

async function ensureDir() {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) { /* ignore */ }
}

const db = {
  data: null,
  async read() {
    await ensureDir();
    try {
      const txt = await fs.readFile(dbFile, 'utf8');
      this.data = JSON.parse(txt || '{}');
    } catch (err) {
      this.data = {};
    }
    if (!this.data.users) this.data.users = [];
    if (!this.data.books) this.data.books = [];
    if (!this.data._meta) this.data._meta = { lastUserId: 0, lastBookId: 0 };
  },
  async write() {
    await ensureDir();
    await fs.writeFile(dbFile, JSON.stringify(this.data, null, 2), 'utf8');
  }
};

async function init() {
  await db.read();
  await db.write();
}

function nextId(type) {
  if (!db.data._meta) db.data._meta = { lastUserId: 0, lastBookId: 0 };
  if (type === 'user') return ++db.data._meta.lastUserId;
  if (type === 'book') return ++db.data._meta.lastBookId;
  return Date.now();
}

module.exports = { db, init, nextId };
