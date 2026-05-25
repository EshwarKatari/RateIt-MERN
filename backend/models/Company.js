const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  foundedOn: {
    type: Number,
    required: [true, 'Founded year is required'],
    min: [1800, 'Year must be after 1800'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: average rating computed from reviews
companySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'company'
});

// Text search index
companySchema.index({ name: 'text', city: 'text', location: 'text', industry: 'text' });

module.exports = mongoose.model('Company', companySchema);
