import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
