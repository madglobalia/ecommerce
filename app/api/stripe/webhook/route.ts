import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // In test mode without webhook secret, just parse the event directly
  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // Dev mode: parse without signature verification
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook parse error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectDB();

      const { clientId, cartItems } = session.metadata || {};
      if (!clientId || !cartItems) {
        console.error("Missing metadata in session");
        return NextResponse.json({ received: true });
      }

      const items = JSON.parse(cartItems);
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      for (const item of items) {
        const product = await Product.findById(item._id);
        if (!product) continue;

        const qty = item.quantity || 1;
        const totalAmount = item.price * qty;

        if (product.stock >= qty) {
          await Order.create({
            productId: item._id,
            clientId,
            quantity: qty,
            totalAmount,
            paymentMethod: "STRIPE",
            status: "Processing",
            estimatedDelivery,
          });

          product.stock -= qty;
          await product.save();
        }
      }

      console.log("✅ Stripe orders created for session:", session.id);
    } catch (err) {
      console.error("Webhook order creation error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
