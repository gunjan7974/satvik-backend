const EventBooking = require("../models/EventBooking");
const EventType = require("../models/EventType");
const PartyHall = require("../models/PartyHall");
const ExtraService = require("../models/ExtraService");

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

    let totalCost =
      eventTypeData.basePrice +
      hallData.price +
      servicesData.reduce((sum, s) => sum + s.price, 0);

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