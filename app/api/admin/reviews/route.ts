import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — all reviews for admin
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Admin reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
