const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Company = require('../models/Company');

// GET /api/reviews?company=id&sort=&page=
router.get('/', async (req, res) => {
  try {
    const { company, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = company ? { company } : {};

    const sortMap = {
      '-createdAt': { createdAt: -1 },
      'createdAt': { createdAt: 1 },
      '-rating': { rating: -1 },
      'rating': { rating: 1 },
      '-likes': { likes: -1 }
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('company', 'name logo');

    // Compute stats for the company
    let stats = null;
    if (company) {
      stats = await Review.calcAverageRating(company);
    }

    res.json({
      success: true,
      data: reviews,
      stats,
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

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { company, fullName, subject, reviewText, rating,
            workLifeBalance, culture, growth, compensation,
            employmentType, isRecommended } = req.body;

    // Verify company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) return res.status(404).json({ success: false, message: 'Company not found' });

    const review = await Review.create({
      company, fullName, subject, reviewText,
      rating: Number(rating),
      workLifeBalance: workLifeBalance ? Number(workLifeBalance) : null,
      culture: culture ? Number(culture) : null,
      growth: growth ? Number(growth) : null,
      compensation: compensation ? Number(compensation) : null,
      employmentType,
      isRecommended: isRecommended !== false
    });

    res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: { likes: review.likes } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
