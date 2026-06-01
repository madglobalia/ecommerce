import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 },
    status: { type: String, enum: ["Processing", "Delivered"], default: "Processing" },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
