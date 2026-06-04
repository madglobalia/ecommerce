import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce";

async function fix() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Add paymentMethod: "COD" to all orders that don't have it
  const result = await db.collection("orders").updateMany(
    { paymentMethod: { $exists: false } },
    { $set: { paymentMethod: "COD" } }
  );

  console.log(`✅ Fixed ${result.modifiedCount} orders — added paymentMethod: "COD"`);
  await mongoose.disconnect();
}

fix().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
