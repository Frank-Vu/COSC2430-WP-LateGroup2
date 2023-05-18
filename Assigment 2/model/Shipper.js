const mongoose = require("mongoose");

const shipperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    distributionHub: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Shipper = mongoose.model("Shipper", shipperSchema);

module.exports = Shipper;
