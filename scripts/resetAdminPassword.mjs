import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce";

async function resetPassword() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const newPassword = "admin123";
  const hash = await bcrypt.hash(newPassword, 10);

  // Verify the hash works before saving
  const check = await bcrypt.compare(newPassword, hash);
  if (!check) {
    console.error("❌ Hash verification failed — aborting");
    await mongoose.disconnect();
    return;
  }

  const result = await db.collection("admins").updateOne(
    { adminId: "admin01" },
    { $set: { password: hash } }
  );

  console.log("✅ Password reset successfully for admin01");
  console.log("   adminId  : admin01");
  console.log("   password : admin123");
  console.log("   hash     :", hash);
  console.log("   verified :", check);

  await mongoose.disconnect();
}

resetPassword().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
