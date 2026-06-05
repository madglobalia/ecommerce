import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const { clientId, cartItems } = session.metadata || {};

    if (!clientId || !cartItems) {
      return NextResponse.json({ error: "Missing session metadata" }, { status: 400 });
    }

    await connectDB();

    // Check if orders already created for this session (avoid duplicates)
    const existing = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (existing) {
      return NextResponse.json({ success: true, alreadyCreated: true });
    }

    const items = JSON.parse(cartItems);
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
    const createdOrders = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item._id)) continue;

      const product = await Product.findById(item._id);
      if (!product) continue;

      const qty = item.quantity || 1;
      const totalAmount = item.price * qty;

      const order = await Order.create({
        productId: item._id,
        clientId,
        quantity: qty,
        totalAmount,
        paymentMethod: "STRIPE",
        status: "Processing",
        estimatedDelivery,
        stripeSessionId: sessionId,
      });

      // Reduce stock
      product.stock = Math.max(0, product.stock - qty);
      await product.save();

      createdOrders.push(order._id);
    }

    return NextResponse.json({
      success: true,
      ordersCreated: createdOrders.length,
    });
  } catch (error) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify session" },
      { status: 500 }
    );
  }
}
