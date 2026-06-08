import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "@/lib/resend";

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

    // Send confirmation email for first order (covers cart summary)
    if (createdOrders.length > 0) {
      try {
        const client = await User.findById(clientId);
        if (client?.email) {
          const firstItem = items[0];
          const firstProduct = await Product.findById(firstItem._id);
          const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const totalAll = items.reduce(
            (sum: number, i: any) => sum + i.price * (i.quantity || 1),
            0
          );
          sendOrderConfirmationEmail({
            toEmail: client.email,
            clientName: client.name || "Customer",
            orderId: createdOrders[0].toString(),
            productTitle:
              createdOrders.length > 1
                ? `${firstProduct?.title || "Product"} + ${createdOrders.length - 1} more item(s)`
                : firstProduct?.title || "Product",
            productImage: firstProduct?.image || undefined,
            quantity: items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0),
            totalAmount: totalAll,
            paymentMethod: "STRIPE",
            estimatedDelivery: estimatedDeliveryStr,
          });
        }
      } catch (emailErr) {
        console.error("Stripe order email error:", emailErr);
      }
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
