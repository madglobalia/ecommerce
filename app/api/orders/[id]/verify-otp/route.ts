import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if OTP is already verified
    if (order.otpVerified) {
      return NextResponse.json({ error: "OTP already verified" }, { status: 400 });
    }

    // Check if OTP exists
    if (!order.deliveryOTP) {
      return NextResponse.json({ error: "No OTP generated for this order" }, { status: 400 });
    }

    // Check if OTP is expired
    if (order.otpExpiresAt && new Date() > order.otpExpiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Verify OTP
    if (order.deliveryOTP !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark OTP as verified
    order.otpVerified = true;
    await order.save();

    return NextResponse.json({
      message: "OTP verified successfully",
      order: {
        id: order._id,
        status: order.status,
        otpVerified: order.otpVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
