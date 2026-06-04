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

async function testLogin(id, password) {
  console.log(`\n--- Testing login: id="${id}" password="${password}" ---`);
  
  await mongoose.connect(MONGODB_URI);

  // Exact same query as the route
  const admin = await Admin.findOne({
    $or: [{ adminId: id }, { email: id }],
  });

  if (!admin) {
    console.log("❌ FAIL: Admin not found");
    await mongoose.disconnect();
    return;
  }
  
  console.log("✅ Admin found:", admin.adminId, admin.email);
  console.log("   Password hash from DB:", admin.password);

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("   bcrypt.compare result:", isMatch);

  if (isMatch) {
    console.log("✅ LOGIN SUCCESS");
  } else {
    console.log("❌ LOGIN FAILED — password mismatch");
    
    // Try to diagnose
    const freshHash = await bcrypt.hash(password, 10);
    console.log("   Fresh hash of '" + password + "':", freshHash);
    const freshCheck = await bcrypt.compare(password, freshHash);
    console.log("   Fresh hash verify:", freshCheck);
  }

  await mongoose.disconnect();
}

await testLogin("admin01", "admin123");
await testLogin("admin@shop.com", "admin123");
