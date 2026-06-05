import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [totalOrders, totalClients, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Order.find({}, { status: 1, quantity: 1, totalAmount: 1, "returnRequest.status": 1, "returnRequest.requested": 1 }).lean(),
    ]);

    const productsSold = orders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);

    const deliveredOrders = orders.filter((o: any) => o.status === "Delivered");
    const returnedOrders = orders.filter(
      (o: any) => o.status === "Returned" && o.returnRequest?.status === "Accepted"
    );

    const deliveredRevenue = deliveredOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const returnedAmount = returnedOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const totalRevenue = deliveredRevenue - returnedAmount;

    const pendingReturns = orders.filter(
      (o: any) => o.returnRequest?.requested === true && o.returnRequest?.status === "Pending"
    ).length;

    return NextResponse.json({
      totalOrders,
      totalClients,
      totalRevenue,
      productsSold,
      completedOrders: deliveredOrders.length,
      cancelledOrders: orders.filter((o: any) => o.status === "Cancelled").length,
      returnedOrders: returnedOrders.length,
      pendingReturns,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      {
        totalOrders: 0,
        totalClients: 0,
        totalRevenue: 0,
        productsSold: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        returnedOrders: 0,
        pendingReturns: 0,
        error: error instanceof Error ? error.message : "Failed to load dashboard",
      },
      { status: 500 }
    );
  }
}
