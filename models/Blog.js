const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Admin",
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["article", "video", "photo"],
    default: "article",
  },
  mediaUrl: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
