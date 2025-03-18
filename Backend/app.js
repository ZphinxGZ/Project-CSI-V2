import express from "express";
import connectDB from "./config/DB.js"; // นำเข้าไฟล์เชื่อมต่อ MongoDB
import userRouter from "./Router/userRouter.js"; // นำเข้า userRouter
import authRouter from "./Router/authRoutes.js"; // นำเข้า authRouter

const app = express();
const PORT = 3000;

// Middleware สำหรับ parse JSON body
app.use(express.json());

// เชื่อมต่อ MongoDB
await connectDB();

// ใช้ userRouter สำหรับเส้นทาง /api/users
app.use("/api/users", userRouter);

// ใช้ authRouter สำหรับเส้นทาง /api/auth
app.use("/api/auth", authRouter);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});