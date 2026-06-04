import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce";

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    paymentMethod: { type: String, default: "COD" },
    totalAmount: { type: Number, required: true },
    estimatedDelivery: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    otpVerified: { type: Boolean, default: false },
    returnRequest: {
      type: {
        requested: { type: Boolean, default: false },
        reason: { type: String },
        customReason: { type: String },
        requestedAt: { type: Date },
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
        adminResponse: { type: String },
        respondedAt: { type: Date },
      },
      default: undefined,
    },
  },
  { timestamps: true }
);

// Clear cached model
if (mongoose.models.Order) delete mongoose.models.Order;
const Order = mongoose.model("Order", OrderSchema);

await mongoose.connect(MONGODB_URI);

const orderId = "6a1d7464b19b28d5803a23d4";

console.log("Testing return request save...");

const updated = await Order.findByIdAndUpdate(
  orderId,
  {
    returnRequest: {
      requested: true,
      reason: "Product is damaged or defective",
      customReason: "Test from script",
      requestedAt: new Date(),
      status: "Pending",
      adminResponse: "",
    },
  },
  { new: true }
);

console.log("Updated order returnRequest:", JSON.stringify(updated?.returnRequest, null, 2));

// Verify from raw DB
const db = mongoose.connection.db;
const raw = await db.collection("orders").findOne({ _id: new mongoose.Types.ObjectId(orderId) });
console.log("Raw DB returnRequest:", JSON.stringify(raw?.returnRequest, null, 2));

await mongoose.disconnect();
