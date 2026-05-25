const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [150, 'Subject cannot exceed 150 characters']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  workLifeBalance: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  culture: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  growth: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  compensation: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    default: 'Full-time'
  },
  isRecommended: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// After save/delete, update company average rating
reviewSchema.statics.calcAverageRating = async function(companyId) {
  const stats = await this.aggregate([
    { $match: { company: companyId } },
    {
      $group: {
        _id: '$company',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);
  return stats.length > 0
    ? { avgRating: Math.round(stats[0].avgRating * 10) / 10, numReviews: stats[0].numReviews }
    : { avgRating: 0, numReviews: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);
