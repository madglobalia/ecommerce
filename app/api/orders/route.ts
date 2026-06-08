import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Revenue from "@/models/Revenue";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    // Validate clientId if provided — prevent crash on "undefined" or invalid ObjectId
    if (clientId && !mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json([], { status: 200 });
    }

    let orders;
    if (clientId) {
      orders = await Order.find({ clientId })
        .populate("productId")
        .populate("clientId")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find()
        .populate("productId")
        .populate("clientId")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { productId, clientId, quantity, paymentMethod, phone } = await req.json();

    if (!productId || !clientId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    if (!["COD", "UPI"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const totalAmount = product.price * quantity;

    // Estimated delivery = order date + 5 days
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await Order.create({
      productId,
      clientId,
      quantity,
      totalAmount,
      paymentMethod,
      status: "Processing",
      estimatedDelivery,
      phone,
    });

    product.stock -= quantity;
    await product.save();

    // Add to revenue for UPI orders (payment received immediately)
    if (paymentMethod === "UPI") {
      let revenue = await Revenue.findOne();
      if (!revenue) {
        revenue = await Revenue.create({
          totalRevenue: 0,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
        });
      }
      revenue.totalRevenue += totalAmount;
      revenue.totalOrders += 1;
      await revenue.save();
    }

    const populatedOrder = await Order.findById(order._id)
      .populate("productId")
      .populate("clientId");

    // Send order confirmation email (non-blocking)
    const client = await User.findById(clientId);
    if (client?.email && populatedOrder) {
      const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      sendOrderConfirmationEmail({
        toEmail: client.email,
        clientName: client.name || "Customer",
        orderId: order._id.toString(),
        productTitle: (populatedOrder.productId as any)?.title || "Product",
        productImage: (populatedOrder.productId as any)?.image || undefined,
        quantity,
        totalAmount,
        paymentMethod,
        estimatedDelivery: estimatedDeliveryStr,
      });
    }

    return NextResponse.json(populatedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
