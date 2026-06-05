import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export async function POST(req: Request) {
  try {
    const { cart, clientId, clientName, clientEmail } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Build line items from cart
    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          description: item.description?.slice(0, 100) || "",
          images: item.image && item.image.startsWith("http") ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // paise
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
      customer_email: clientEmail || undefined,
      metadata: {
        clientId,
        clientName,
        cartItems: JSON.stringify(
          cart.map((i: any) => ({
            _id: i._id,
            quantity: i.quantity || 1,
            price: i.price,
          }))
        ),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment session" },
      { status: 500 }
    );
  }
}
