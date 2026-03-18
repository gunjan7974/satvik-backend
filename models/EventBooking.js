const mongoose = require("mongoose");

const eventBookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true,
    },

    partyHall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PartyHall",
      required: true,
    },

    extraServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraService",
      },
    ],

    contactName: String,
    contactPhone: String,
    eventDate: Date,

    totalCost: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);