const mongoose = require("mongoose");

const partyHallSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: Number,
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PartyHall", partyHallSchema);