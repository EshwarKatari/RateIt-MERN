const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Company = require('../models/Company');
const Review = require('../models/Review');

// Multer config for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// GET /api/companies — list with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, city, industry, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (city) query.city = { $regex: city, $options: 'i' };
    if (industry) query.industry = { $regex: industry, $options: 'i' };

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Attach review stats to each company
    const withStats = await Promise.all(companies.map(async (c) => {
      const stats = await Review.calcAverageRating(c._id);
      return { ...c, ...stats };
    }));

    res.json({
      success: true,
      data: withStats,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const stats = await Review.calcAverageRating(company._id);
    res.json({ success: true, data: { ...company, ...stats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/companies — create company
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, location, city, foundedOn, description, website, industry, size } = req.body;
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;

    const company = await Company.create({
      name, location, city, foundedOn: Number(foundedOn),
      description, website, industry, size, logo
    });

    res.status(201).json({ success: true, data: company, message: 'Company created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/companies/:id
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.logo = `/uploads/logos/${req.file.filename}`;

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    res.json({ success: true, data: company, message: 'Company updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/companies/:id
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    await Review.deleteMany({ company: req.params.id });
    res.json({ success: true, message: 'Company and all reviews deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/companies/meta/cities — distinct cities for filter
router.get('/meta/cities', async (req, res) => {
  try {
    const cities = await Company.distinct('city');
    res.json({ success: true, data: cities.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
