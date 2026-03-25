const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup for parsing FormData
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

const { 
  createEventBooking,
  getAllEventBookings,
  deleteEventBooking,
  updateBookingStatus
} = require("../controllers/eventController");

// 🟢 GET ALL BOOKINGS (Admin Only)
router.get("/", protect, admin, getAllEventBookings);

// 🟢 POST Event Booking
router.post("/", protect, createEventBooking);

// 🟢 DELETE Booking (Admin Only)
router.delete("/:id", protect, admin, deleteEventBooking);

// 🟢 UPDATE Status (Admin Only)
router.patch("/:id/status", protect, admin, updateBookingStatus);

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

// 🔹 POST Event Type (Admin Only)
router.post("/types", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, basePrice } = req.body;
    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const type = await EventType.create({ name, basePrice, image });
    res.status(201).json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 UPDATE Event Type (Admin Only)
router.put("/types/:id", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, basePrice } = req.body;
    const type = await EventType.findById(req.params.id);
    
    if (!type) {
      return res.status(404).json({ message: "Event type not found" });
    }

    type.name = name || type.name;
    type.basePrice = basePrice !== undefined ? basePrice : type.basePrice;

    if (req.file) {
      type.image = `/uploads/${req.file.filename}`;
    }

    await type.save();
    res.json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// 🔹 DELETE Event Type (Admin Only)
router.delete("/types/:id", protect, admin, async (req, res) => {
  try {
    await EventType.findByIdAndDelete(req.params.id);
    res.json({ message: "Event type removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// 🔹 POST Party Hall (Admin Only)
router.post("/halls", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, capacity, pricePerPlate, isAvailable } = req.body;
    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const hall = await PartyHall.create({ name, capacity, pricePerPlate, isAvailable, image });
    res.status(201).json(hall);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 UPDATE Party Hall (Admin Only)
router.put("/halls/:id", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, capacity, pricePerPlate, isAvailable } = req.body;
    const hall = await PartyHall.findById(req.params.id);
    
    if (!hall) {
      return res.status(404).json({ message: "Party Hall not found" });
    }

    hall.name = name || hall.name;
    hall.capacity = capacity || hall.capacity;
    hall.pricePerPlate = pricePerPlate || hall.pricePerPlate;
    hall.isAvailable = isAvailable !== undefined ? isAvailable : hall.isAvailable;

    if (req.file) {
      hall.image = `/uploads/${req.file.filename}`;
    }

    await hall.save();
    res.json(hall);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 DELETE Party Hall (Admin Only)
router.delete("/halls/:id", protect, admin, async (req, res) => {
  try {
    await PartyHall.findByIdAndDelete(req.params.id);
    res.json({ message: "Party Hall removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// 🔹 POST Extra Service (Admin Only)
router.post("/services", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, unit } = req.body;
    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const service = await ExtraService.create({ name, price, unit, image });
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 UPDATE Extra Service (Admin Only)
router.put("/services/:id", protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, unit } = req.body;
    const service = await ExtraService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.name = name || service.name;
    service.price = price || service.price;
    service.unit = unit || service.unit;

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 DELETE Extra Service (Admin Only)
router.delete("/services/:id", protect, admin, async (req, res) => {
  try {
    await ExtraService.findByIdAndDelete(req.params.id);
    res.json({ message: "Extra Service removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;