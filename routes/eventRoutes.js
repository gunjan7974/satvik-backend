const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createEventBooking } = require("../controllers/eventController");

const EventType = require("../models/EventType");
const PartyHall = require("../models/PartyHall");
const ExtraService = require("../models/ExtraService");


// 🔹 GET Event Types
router.get("/types", async (req, res) => {
  try {
    const types = await EventType.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 GET Party Halls
router.get("/halls", async (req, res) => {
  try {
    const halls = await PartyHall.find();
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 GET Extra Services
router.get("/services", async (req, res) => {
  try {
    const services = await ExtraService.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 POST Event Booking
router.post("/", protect, createEventBooking);

module.exports = router;