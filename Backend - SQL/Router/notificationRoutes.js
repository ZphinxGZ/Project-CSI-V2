import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const notificationRouter = express.Router();

notificationRouter.post("/", authenticate, async (req, res) => {
  try {
    const { booking_id, room_id, message } = req.body;

    const connection = await connectDB(); // สร้างการเชื่อมต่อ MySQL

    const query = `
      INSERT INTO notifications (user_id, booking_id, room_id, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [req.user.user_id, booking_id, room_id, message, false]; // เพิ่ม is_read เป็น false

    await connection.execute(query, values); // ใช้ connection.execute แทน connectDB.execute

    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

notificationRouter.get("/", authenticate, async (req, res) => {
  try {
    const connection = await connectDB(); // สร้างการเชื่อมต่อ MySQL

    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [notifications] = await connection.execute(query, [req.user.user_id]); // ใช้ connection.execute แทน connectDB.execute

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

export default notificationRouter;
