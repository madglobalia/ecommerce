import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_ID = process.env.ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { isAdmin: true },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, isAdmin: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
