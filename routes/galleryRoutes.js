const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `gallery-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
});

// GET /api/gallery (Public - List)
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gallery (Admin - Add)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, featured } = req.body;
    
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const newItem = new Gallery({
      title,
      category,
      description,
      featured: featured === 'true',
      image: `/uploads/${req.file.filename}`
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/gallery/:id (Admin - Delete)
router.delete('/:id', async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
