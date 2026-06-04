// Run this once to create the first admin:
// node scripts/seedAdmin.mjs

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce";

const AdminSchema = new mongoose.Schema(
  {
    adminId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await Admin.findOne({ adminId: "admin01" });
  if (existing) {
    console.log("Admin already exists:", existing.adminId);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await Admin.create({
    adminId: "admin01",
    name: "Super Admin",
    email: "admin@shop.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created successfully:");
  console.log("   adminId :", admin.adminId);
  console.log("   name    :", admin.name);
  console.log("   email   :", admin.email);
  console.log("   password: admin123  (change this after first login)");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
