import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    stock: { type: Number, default: 0 },
    image: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);