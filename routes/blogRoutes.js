const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|mp4|webm|ogg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed!"));
    }
  }
});

const blogUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// 🔹 GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 GET single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 POST new post (Admin Only)
router.post("/", protect, admin, blogUpload, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, featured, type, mediaUrl } = req.body;
    let image = "";
    let videoUrl = "";
    
    if (req.files) {
      if (req.files.image) image = `/uploads/${req.files.image[0].filename}`;
      if (req.files.video) videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    const post = await Blog.create({ 
      title, excerpt, content, author, category, 
      featured: featured === 'true', 
      type, mediaUrl, image, videoUrl 
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 UPDATE post (Admin Only)
router.put("/:id", protect, admin, blogUpload, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, featured, type, mediaUrl } = req.body;
    const post = await Blog.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.author = author || post.author;
    post.category = category || post.category;
    post.featured = featured !== undefined ? (featured === 'true') : post.featured;
    post.type = type || post.type;
    post.mediaUrl = mediaUrl || post.mediaUrl;

    if (req.files) {
      if (req.files.image) post.image = `/uploads/${req.files.image[0].filename}`;
      if (req.files.video) post.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 DELETE post (Admin Only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
