const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Food', 'Events', 'Interior', 'Celebrations', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
