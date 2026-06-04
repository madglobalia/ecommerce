import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Use raw DB query to avoid any model caching issues
    const returns = await Order.find({ "returnRequest.requested": true })
      .populate("productId")
      .populate("clientId")
      .sort({ "returnRequest.requestedAt": -1 });

    return NextResponse.json(returns);
  } catch (error) {
    console.error("Fetch returns error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch return requests" },
      { status: 500 }
    );
  }
}
