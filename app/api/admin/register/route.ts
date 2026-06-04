import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
  try {
    const { adminId, name, email, password } = await req.json();

    if (!adminId || !name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ adminId }, { email }],
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin ID or email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      adminId,
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
