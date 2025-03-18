import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ชื่อผู้ใช้
  password_hash: { type: String, required: true }, // รหัสผ่านที่เข้ารหัสแล้ว
  role: { type: String, enum: ["user", "admin"], default: "user" }, // สิทธิ์ (user หรือ admin)
  created_at: { type: Date, default: Date.now }, // วันที่สร้างบัญชี
});

export default mongoose.model("User", userSchema);