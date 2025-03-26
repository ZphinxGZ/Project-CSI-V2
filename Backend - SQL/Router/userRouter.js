import express from "express";
import connectDB from "../config/DB.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const connection = await connectDB();
    const [users] = await connection.execute("SELECT user_id, username, role FROM users");

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error: error.message });
  }
});

userRouter.get("/me", authenticate, (req, res) => {
  res.status(200).json(req.user);
});

userRouter.get("/reports", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const connection = await connectDB();

    // Fetch total users
    const [users] = await connection.execute("SELECT COUNT(*) AS totalUsers FROM users");
    const totalUsers = users[0].totalUsers;

    // Fetch bookings and calculate statistics
    const [bookings] = await connection.execute(
      `SELECT u.username, COUNT(b.booking_id) AS bookingCount 
       FROM bookings b 
       JOIN users u ON b.user_id = u.user_id 
       GROUP BY u.username`
    );

    const mostActiveUser = bookings.reduce(
      (max, user) => (user.bookingCount > max.bookingCount ? user : max),
      { username: "", bookingCount: 0 }
    );

    res.status(200).json({
      totalUsers,
      mostActiveUser: { username: mostActiveUser.username, count: mostActiveUser.bookingCount },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user reports", error: error.message });
  }
});

export default userRouter;