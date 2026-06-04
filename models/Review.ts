import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.Review as mongoose.Model<any>) ||
  mongoose.model("Review", ReviewSchema);
