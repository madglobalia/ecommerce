import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// PUT — Admin approve or reject
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const { status, adminNote } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status, adminNote: adminNote || "" },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE — Admin delete review
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
