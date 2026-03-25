const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/authMiddleware");

// 🔹 GET all messages (Admin Only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 POST new message (Public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 UPDATE message status (Admin Only)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.status = status;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 DELETE message (Admin Only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
