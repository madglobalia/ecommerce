import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — fetch approved reviews (public)
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ status: "Approved" })
      .sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST — client submits a review
export async function POST(req: Request) {
  try {
    await connectDB();
    const { clientId, clientName, productId, productName, rating, title, comment } =
      await req.json();

    if (!clientId || !clientName || !rating || !title || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const review = await Review.create({
      clientId,
      clientName,
      productId: productId || null,
      productName: productName || null,
      rating,
      title,
      comment,
      status: "Pending",
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
