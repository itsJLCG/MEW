const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
    default: 1,
  },
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Ensure a customer can only have one unique product in the cart
CartSchema.index({ customerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", CartSchema);
