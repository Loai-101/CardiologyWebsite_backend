const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['consultation', 'treatment', 'package', 'checkup', 'other']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validUntil: {
    type: Date
  },
  features: [{
    type: String,
    trim: true
  }],
  terms: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for discount percentage calculation
offerSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for formatted price
offerSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted original price
offerSchema.virtual('formattedOriginalPrice').get(function() {
  if (this.originalPrice) {
    return `$${this.originalPrice.toFixed(2)}`;
  }
  return null;
});

module.exports = mongoose.model('Offer', offerSchema);
