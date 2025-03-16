import express from "express";
import mongoose from "mongoose";

const userRouter = express.Router();

// เส้นทางสำหรับการลงทะเบียนผู้ใช้
userRouter.post("/register", (req, res) => {
  // API นี้ใช้สำหรับลงทะเบียนผู้ใช้ใหม่
  res.send("ลงทะเบียนผู้ใช้ใหม่");
});

// เส้นทางสำหรับการเข้าสู่ระบบ
userRouter.post("/login", (req, res) => {
  // API นี้ใช้สำหรับเข้าสู่ระบบของผู้ใช้ที่มีอยู่
  res.send("เข้าสู่ระบบผู้ใช้");
});

// เส้นทางสำหรับดูปฏิทินการจอง
userRouter.get("/calendar", (req, res) => {
  // API นี้ใช้สำหรับดึงข้อมูลปฏิทินที่แสดงวันว่างและวันที่ถูกจอง
  res.send("ดึงข้อมูลปฏิทินการจอง");
});

// เส้นทางสำหรับการจองห้องประชุม
userRouter.post("/book", (req, res) => {
  // API นี้ใช้สำหรับจองห้องประชุมตามข้อมูลที่ผู้ใช้กรอก
  res.send("จองห้องประชุม");
});

// เส้นทางสำหรับดูประวัติการจองของผู้ใช้
userRouter.get("/history", (req, res) => {
  // API นี้ใช้สำหรับดึงประวัติการจองของผู้ใช้ที่เข้าสู่ระบบ
  res.send("ดึงประวัติการจองของผู้ใช้ที่เข้าสู่ระบบ");
});

// เส้นทางสำหรับดูประวัติการจองทั้งหมด (สำหรับผู้ดูแลระบบ)
userRouter.get("/history/admin", (req, res) => {
  // API นี้ใช้สำหรับดึงประวัติการจองทั้งหมด (เฉพาะผู้ดูแลระบบ)
  res.send("ดึงประวัติการจองทั้งหมด (สำหรับผู้ดูแลระบบ)");
});

// เส้นทางสำหรับดูการแจ้งเตือน
userRouter.get("/notifications", (req, res) => {
  // API นี้ใช้สำหรับดึงการแจ้งเตือนสำหรับผู้ใช้หรือผู้ดูแลระบบ
  res.send("ดึงการแจ้งเตือนสำหรับผู้ใช้หรือผู้ดูแลระบบ");
});

// เส้นทางตัวอย่างสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
userRouter.get("/", async (req, res) => {
  try {
    // Fetch all users without excluding any fields
    const users = await mongoose.connection.db
      .collection("Users")
      .find({})
      .toArray();

    res.status(200).json({
      message: "ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      error: error.message,
    });
  }
});

// เส้นทางตัวอย่างสำหรับสร้างผู้ใช้ใหม่
userRouter.post("/", (req, res) => {
  res.send("สร้างผู้ใช้ใหม่");
});

// เส้นทางตัวอย่างสำหรับดึงข้อมูลผู้ใช้ตาม ID
userRouter.get("/:id", (req, res) => {
  res.send(`ดึงข้อมูลผู้ใช้ที่มี ID: ${req.params.id}`);
});

export default userRouter;
