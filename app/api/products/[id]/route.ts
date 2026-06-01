import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const product = await Product.findById(id);

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const body = await req.json();

  const product = await Product.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const product = await Product.findByIdAndDelete(id);

  return NextResponse.json(product);
}