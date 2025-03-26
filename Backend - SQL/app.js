import express from "express";
import connectDB from "./config/DB.js"; // นำเข้าไฟล์เชื่อมต่อ MySQL
import userRouter from "./Router/userRouter.js"; // นำเข้า userRouter
import roomRouter from "./Router/roomRoutes.js"; // นำเข้า roomRouter
import notificationRouter from "./Router/notificationRoutes.js"; // Import notificationRouter
import bookingRouter from "./Router/bookingRoutes.js"; // นำเข้า bookingRouter
import reportRouter from "./Router/reportRouter.js"; // เพิ่ม reportRouter
import calendarRouter from "./Router/calendarRouter.js"; // เพิ่ม calendarRouter
import authRouter from "./Router/authRoutes.js"; // นำเข้า authRouter

import cors from "cors";

const app = express();
const PORT = 3456;

// Middleware สำหรับ parse JSON body
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MySQL
await connectDB();

// ใช้ userRouter สำหรับเส้นทาง /api/users
app.use("/api/users", userRouter);

// ใช้ authRouter สำหรับเส้นทาง /api/auth
app.use("/api/auth", authRouter);

// ใช้ roomRouter สำหรับเส้นทาง /api/rooms
app.use("/api/rooms", roomRouter);

// ใช้ bookingRouter สำหรับเส้นทาง /api/bookings
app.use("/api/bookings", bookingRouter); // Use bookingRouter for bookings and reports

// ใช้ reportRouter สำหรับเส้นทาง /api/reports
app.use("/api/reports", reportRouter);

// ใช้ calendarRouter สำหรับเส้นทาง /api/calendar
app.use("/api/calendar", calendarRouter);

// ใช้ notificationRouter สำหรับเส้นทาง /api/notifications
app.use("/api/notifications", notificationRouter);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});