import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error: error.message });
  }
});

// API สำหรับดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
userRouter.get("/me", authenticate, (req, res) => {
  res.status(200).json(req.user);
});

export default userRouter;