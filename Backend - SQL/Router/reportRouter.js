import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const reportRouter = express.Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get booking reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Booking reports fetched successfully
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Error fetching booking reports
 */
reportRouter.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const connection = await connectDB();

    const [bookings] = await connection.query(
      `SELECT b.*, r.room_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.room_id`
    );

    const bookingsPerDay = bookings.reduce((acc, booking) => {
      const date = booking.start_time.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const roomBookings = bookings.reduce((acc, booking) => {
      const roomName = booking.room_name;
      acc[roomName] = (acc[roomName] || 0) + 1;
      return acc;
    }, {});

    const mostBookedRoom = Object.entries(roomBookings).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    res.status(200).json({
      bookingsPerDay,
      mostBookedRoom: { room: mostBookedRoom[0], count: mostBookedRoom[1] },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking reports", error: error.message });
  }
});

export default reportRouter;
