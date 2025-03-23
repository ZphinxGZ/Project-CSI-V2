import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js"; // Import the Booking model
import { authenticate } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the logged-in user's details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/reports:
 *   get:
 *     summary: Get user statistics (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *       403:
 *         description: Access denied
 */

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

// GET /api/users/reports: Fetch user statistics
userRouter.get("/reports", authenticate, async (req, res) => {
  try {
    // ตรวจสอบว่า role ของผู้ใช้เป็น admin เท่านั้น
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    const users = await User.find({});
    const totalUsers = users.length;

    // ดึงข้อมูลการจองทั้งหมด
    const bookings = await Booking.find({}).populate("user_id", "username");

    // สถิติ: ผู้ใช้ที่จองบ่อยที่สุด
    const userBookings = bookings.reduce((acc, booking) => {
      const username = booking.user_id.username;
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    }, {});

    const mostActiveUser = Object.entries(userBookings).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    res.status(200).json({
      totalUsers,
      mostActiveUser: { username: mostActiveUser[0], count: mostActiveUser[1] },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user reports", error: error.message });
  }
});

export default userRouter;