const mongoose = require("mongoose");

const groundSchema = new mongoose.Schema(
  {
    groundName: {
      type: String,
      required: true,
    },
    sportType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    availableSlots: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    owner: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ground", groundSchema);