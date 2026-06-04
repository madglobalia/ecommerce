import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json(
        { error: "Admin ID and password required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by adminId or email
    const admin = await Admin.findOne({
      $or: [{ adminId: id }, { email: id }],
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        adminUniqueId: admin.adminId,
        name: admin.name,
        email: admin.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      isAdmin: true,
      admin: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
