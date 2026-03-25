const mongoose = require("mongoose");

const partyHallSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerPlate: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("PartyHall", partyHallSchema);