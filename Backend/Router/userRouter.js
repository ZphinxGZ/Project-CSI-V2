import express from "express";
import mongoose from "mongoose";

// สร้าง router
const userRouter = express.Router();

// Schema สำหรับผู้ใช้
const userSchema = new mongoose.Schema({
  username: String,
  password_hash: String,
  role: String,
  created_at: Date,
});

// สร้างโมเดล User จาก schema
const User = mongoose.model("User", userSchema);

// API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
userRouter.get("/", async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    const users = await User.find({});

    // หากไม่มีผู้ใช้ในฐานข้อมูล
    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    // ส่งข้อมูลผู้ใช้กลับไปยัง client
    res.status(200).json(users);
  } catch (error) {
    // หากเกิดข้อผิดพลาด
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error: error.message });
  }
});

// ส่งออก router
export default userRouter;