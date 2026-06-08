import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Revenue from "@/models/Revenue";
import { NextResponse } from "next/server";
import { sendDeliveryOtpEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id)
      .populate("productId")
      .populate("clientId");
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    // If cancelling, restore product stock and update revenue
    if (body.status === "Cancelled") {
      const existingOrder = await Order.findById(id);
      if (existingOrder && existingOrder.status !== "Cancelled") {
        const product = await Product.findById(existingOrder.productId);
        if (product) {
          product.stock += existingOrder.quantity;
          await product.save();
        }

        // Subtract from revenue if payment was already received
        // UPI orders: payment received at order placement
        // COD orders: payment received at delivery
        let revenue = await Revenue.findOne();
        if (!revenue) {
          revenue = await Revenue.create({
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
          });
        }

        if (existingOrder.paymentMethod === "UPI" || existingOrder.status === "Delivered") {
          revenue.totalRevenue -= existingOrder.totalAmount;
        }
        revenue.cancelledOrders += 1;
        await revenue.save();
      }
    }
    const updateData: any = { status: body.status };
    if (body.status === "Shipped") {
      updateData.shippedAt = new Date();
    }
    if (body.status === "Delivered") {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date();
      otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30); // OTP expires in 30 minutes

      updateData.deliveredAt = new Date();
      updateData.deliveryOTP = otp;
      updateData.otpExpiresAt = otpExpiresAt;
      updateData.otpVerified = false;

      // Add to revenue when COD order is delivered (payment received on delivery)
      // UPI orders already added revenue at order placement
      const orderForRevenue = await Order.findById(id);
      if (orderForRevenue && orderForRevenue.status !== "Delivered") {
        if (orderForRevenue.paymentMethod === "COD") {
          let revenue = await Revenue.findOne();
          if (!revenue) {
            revenue = await Revenue.create({
              totalRevenue: 0,
              totalOrders: 0,
              completedOrders: 0,
              cancelledOrders: 0,
            });
          }
          revenue.totalRevenue += orderForRevenue.totalAmount;
          revenue.totalOrders += 1;
          await revenue.save();
        }
        // Track completed orders regardless of payment method
        let revenue = await Revenue.findOne();
        if (!revenue) {
          revenue = await Revenue.create({
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
          });
        }
        revenue.completedOrders += 1;
        await revenue.save();
      }

      // Get order details and send OTP via email
      const existingOrder = await Order.findById(id).populate("clientId").populate("productId");
      if (existingOrder) {
        const client = existingOrder.clientId as any;
        const product = existingOrder.productId as any;

        console.log(`📧 DELIVERY OTP for order ${id}: ${otp} (Valid for 30 minutes)`);

        // Send OTP via email using Resend
        if (client?.email) {
          await sendDeliveryOtpEmail({
            toEmail: client.email,
            clientName: client.name || "Customer",
            orderId: id,
            productTitle: product?.title || "Your Product",
            otp,
          });
        } else {
          console.log("⚠️ No client email found for OTP delivery");
        }
      }
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("productId")
      .populate("clientId");

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findByIdAndDelete(id);
    return NextResponse.json(order);                                                                                             
  } catch (error) {
    console.error("Order delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete order" },
      { status: 500 }
    );
  }
}
