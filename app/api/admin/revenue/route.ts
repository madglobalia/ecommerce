import { connectDB } from "@/lib/mongodb";
import Revenue from "@/models/Revenue";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    let revenue = await Revenue.findOne();

    // Create revenue document if it doesn't exist
    if (!revenue) {
      revenue = await Revenue.create({
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      });
    }

    return NextResponse.json(revenue);
  } catch (error) {
    console.error("Revenue fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch revenue" },
      { status: 500 }
    );
  }
}
