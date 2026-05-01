const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_KEY = process.env.UPLOAD_KEY || 'dimbel-upload-key';
const dataDir = path.join(__dirname, 'data');
const dataPath = path.join(dataDir, 'entries.json');

const defaultEntries = [
  {
    title: 'Morning Pages: Energy in Motion',
    date: 'May 1, 2026',
    content: [
      'Today I leaned into the rhythm of a slow morning and found that the first draft of an idea always feels quieter than expected.',
      'I took notes by hand, then built the outline digitally before returning to the pen. It helped keep the creative energy moving without losing the shape of the thought.',
      'Each entry feels less like a log and more like a way to make the small daily shifts visible. That\'s the thing I want this journal to be.',
    ],
  },
  {
    title: 'Design Patterns for Slow Work',
    date: 'April 27, 2026',
    content: [
      'A strong layout is not only about visual balance, it\'s also about giving the reader a place to begin and a place to return.',
      'I experimented with a right-hand panel for navigation and a larger reading area on the left, which makes the experience feel more contemplative.',
      'Consistency in spacing and typographic hierarchy allows the page to breathe, even when the content is dense.',
    ],
  },
  {
    title: 'Why Entry-Based Pages Work',
    date: 'April 20, 2026',
    content: [
      'Breaking content into discrete entries makes it easier to choose what to focus on without overwhelming the page.',
      'The navigation panel can be a simple list, but it plays a huge role in helping visitors discover and revisit entries.',
      'A clean, centered reading panel with a strong title gives each post enough room to feel important.',
    ],
  },
];

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(defaultEntries, null, 2));
  }
}

function loadEntries() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load entries:', error);
  }
  return defaultEntries;
}

function saveEntries(entries) {
  ensureDataStore();
  fs.writeFileSync(dataPath, JSON.stringify(entries, null, 2));
}

function parseEntryText(text, fileName) {
  const title = fileName
    ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim()
    : 'New Entry';
  const paragraphs = text
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return {
    title: title || 'New Entry',
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: paragraphs.length ? paragraphs : [text.trim() || ''],
  };
}

let entries = loadEntries();

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/entries', (req, res) => {
  res.json(entries);
});

app.post('/api/entries', (req, res) => {
  const { key, fileName, content } = req.body;
  if (key !== UPLOAD_KEY) {
    return res.status(401).json({ error: 'Invalid upload key' });
  }
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'File content is required' });
  }
  const entry = parseEntryText(content, fileName);
  entries.unshift(entry);
  saveEntries(entries);
  res.json(entry);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
