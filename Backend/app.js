import express from "express";
import connectDB from "./config/DB.js"; // นำเข้าไฟล์เชื่อมต่อ MongoDB
import userRouter from "./Router/userRouter.js"; // นำเข้า userRouter

const app = express();
const PORT = 3000;

// Middleware สำหรับ parse JSON body
app.use(express.json());

// เชื่อมต่อ MongoDB
await connectDB();

// ใช้ userRouter สำหรับเส้นทาง /api/users
app.use("/api/users", userRouter);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${PORT}`);
});