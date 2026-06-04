import mongoose, { Schema } from "mongoose";

const ReturnRequestSchema = new Schema(
  {
    requested: { type: Boolean, default: false },
    reason: { type: String },
    customReason: { type: String },
    requestedAt: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    adminResponse: { type: String },
    respondedAt: { type: Date },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"],
      default: "COD",
    },
    totalAmount: { type: Number, required: true },
    estimatedDelivery: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    phone: { type: String },
    deliveryOTP: { type: String },
    otpExpiresAt: { type: Date },
    otpVerified: { type: Boolean, default: false },
    returnRequest: { type: ReturnRequestSchema, default: undefined },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as mongoose.Model<any>) ||
  mongoose.model("Order", OrderSchema);
