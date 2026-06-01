import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user._id, uniqueId: user.uniqueId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    user: { _id: user._id.toString(), name: user.name, email: user.email, uniqueId: user.uniqueId },
  });
}
