import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// POST — Client submits return request
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();
    const { reason, customReason } = body;

    if (!reason) {
      return NextResponse.json({ error: "Return reason is required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Delivered") {
      return NextResponse.json(
        { error: `Only delivered orders can be returned. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Check 7-day return window
    const deliveredAt = order.deliveredAt || order.createdAt;
    const daysSinceDelivery =
      (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 7) {
      return NextResponse.json(
        { error: "Return window has expired (7 days from delivery)" },
        { status: 400 }
      );
    }

    if (order.returnRequest?.requested) {
      return NextResponse.json(
        { error: "Return request already submitted" },
        { status: 400 }
      );
    }

    // Use native MongoDB driver to avoid Mongoose schema/cache issues
    const collection = mongoose.connection.collection("orders");
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          returnRequest: {
            requested: true,
            reason: reason,
            customReason: customReason || "",
            requestedAt: new Date(),
            status: "Pending",
            adminResponse: "",
            respondedAt: null,
          },
          updatedAt: new Date(),
        },
      }
    );

    const updated = await Order.findById(id);
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT — Admin accepts or rejects return
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const { action, adminResponse } = await req.json();

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.returnRequest?.requested) {
      return NextResponse.json({ error: "No return request found for this order" }, { status: 400 });
    }

    if (order.returnRequest.status !== "Pending") {
      return NextResponse.json(
        { error: `Return request already ${order.returnRequest.status}` },
        { status: 400 }
      );
    }

    const updateFields: Record<string, unknown> = {
      "returnRequest.status": action === "accept" ? "Accepted" : "Rejected",
      "returnRequest.adminResponse":
        adminResponse || (action === "accept" ? "Return accepted" : "Return rejected"),
      "returnRequest.respondedAt": new Date(),
      updatedAt: new Date(),
    };

    if (action === "accept") {
      updateFields["status"] = "Returned";
    }

    const collection = mongoose.connection.collection("orders");
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateFields }
    );

    const updated = await Order.findById(id)
      .populate("productId")
      .populate("clientId");

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Return action error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
