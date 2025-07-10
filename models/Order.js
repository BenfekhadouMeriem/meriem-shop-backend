import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      variant: {
        color: { type: String },
        size: { type: String },
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  client: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      state: { type: String },
      city: { type: String },
    },
  },
  type: {
    type: String,
    enum: ["delivery", "stopdesk"],
    default: "delivery",
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
