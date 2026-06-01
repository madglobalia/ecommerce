import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: any
) {
  await connectDB();

  const body = await req.json();

  const order = await Order.findByIdAndUpdate(params.id, body, { new: true }).populate("productId").populate("clientId");

  return NextResponse.json(order);
}

export async function DELETE(
  req: Request,
  { params }: any
) {
  await connectDB();

  const order = await Order.findByIdAndDelete(params.id);

  return NextResponse.json(order);
}
