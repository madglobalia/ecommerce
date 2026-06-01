import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  let orders;
  if (clientId) {
    orders = await Order.find({ clientId }).populate("productId").populate("clientId");
  } else {
    orders = await Order.find().populate("productId").populate("clientId");
  }

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { productId, clientId, quantity } = await req.json();

    // Validate required fields
    if (!productId || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const totalAmount = product.price * quantity;

    const order = await Order.create({
      productId,
      clientId,
      quantity,
      totalAmount,
      status: "Processing",
    });

    product.stock -= quantity;
    await product.save();

    const populatedOrder = await Order.findById(order._id).populate("productId").populate("clientId");

    return NextResponse.json(populatedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
