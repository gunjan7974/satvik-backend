const EventBooking = require("../models/EventBooking");
const EventType = require("../models/EventType");
const PartyHall = require("../models/PartyHall");
const ExtraService = require("../models/ExtraService");

// 🟢 GET All Event Bookings (Admin)
exports.getAllEventBookings = async (req, res, next) => {
  try {
    const bookings = await EventBooking.find()
      .populate("user", "name email phone")
      .populate("eventType")
      .populate("partyHall")
      .populate("extraServices")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// 🟢 Create Event Booking
exports.createEventBooking = async (req, res, next) => {
  try {
    const {
      eventType,
      partyHall,
      extraServices,
      contactName,
      contactPhone,
      eventDate,
    } = req.body;

    const eventTypeData = await EventType.findById(eventType);
    const hallData = await PartyHall.findById(partyHall);
    const servicesData = extraServices ? await ExtraService.find({
      _id: { $in: extraServices },
    }) : [];

    if (!eventTypeData || !hallData) {
      res.status(400);
      throw new Error("Invalid event type or party hall data");
    }

    // Calculation logic
    let totalCost = 0;
    if (eventTypeData.basePrice) totalCost += eventTypeData.basePrice;
    
    // Party Hall Price based on Capacity
    if (hallData.pricePerPlate) {
      totalCost += (hallData.pricePerPlate * (hallData.capacity || 50));
    }

    totalCost += servicesData.reduce((sum, s) => sum + (s.price || 0), 0);

    const booking = await EventBooking.create({
      user: req.user._id,
      eventType,
      partyHall,
      extraServices,
      contactName,
      contactPhone,
      eventDate,
      totalCost,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// 🟢 Delete Event Booking
exports.deleteEventBooking = async (req, res, next) => {
  try {
    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// 🟢 Update Booking Status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
    booking.status = status || booking.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    next(error);
  }
};