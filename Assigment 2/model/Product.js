const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 10,
      maxlength: 20,
      required: true,
    },
    price: {
      type: Number,
      min: 0.01,
      required: true,
    },
    image: {
      data: Buffer,
      mimeType: String,
    },
    description: {
      type: String,
      maxlength: 500,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
