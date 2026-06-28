const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/library_management')
  .then(() => console.log('MongoDB connected: library_management'))
  .catch(err => console.error('MongoDB error:', err));

// Schema
const bookSchema = new mongoose.Schema({
  bookId:    { type: String, required: true, unique: true },
  title:     { type: String, required: true },
  author:    { type: String, required: true },
  category:  { type: String, required: true, enum: ['Fiction','Non-Fiction','Science','Technology','History','Biography','Education','Other'] },
  isbn:      { type: String },
  available: { type: Boolean, default: true },
  addedAt:   { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// CREATE
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ ALL (with optional category filter)
app.get('/api/books', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const rx = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: rx }, { author: rx }, { bookId: rx }];
    }
    const books = await Book.find(filter).sort({ addedAt: -1 });
    res.json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// READ ONE
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Task 2 - Library Management running on http://localhost:${PORT}`));
