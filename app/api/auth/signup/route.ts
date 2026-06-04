import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const uniqueId = "USR" + Date.now().toString().slice(-6);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    uniqueId,
  });

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
