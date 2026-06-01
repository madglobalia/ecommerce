import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const totalOrders = await Order.countDocuments();
  const totalClients = await User.countDocuments();
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const productsSold = orders.reduce((sum, order) => sum + order.quantity, 0);

  return NextResponse.json({
    totalOrders,
    totalClients,
    totalRevenue,
    productsSold,
  });
}
