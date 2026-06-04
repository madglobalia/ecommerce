import mongoose from "mongoose";

const RevenueSchema = new mongoose.Schema(
  {
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Revenue || mongoose.model("Revenue", RevenueSchema);
