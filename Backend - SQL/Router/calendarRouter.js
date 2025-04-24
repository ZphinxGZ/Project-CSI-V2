import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

/**
 * @swagger
 * tags:
 *   name: Calendar
 *   description: Calendar data for bookings
 */

const calendarRouter = express.Router();

/**
 * @swagger
 * /api/calendar/:
 *   get:
 *     summary: Get calendar data for the current user
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendar data
 *       500:
 *         description: Server error
 */

calendarRouter.get("/", authenticate, async (req, res) => {
  try {
    const connection = await connectDB();

    const [bookings] = await connection.query(
      `SELECT b.*, r.room_name, r.location 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.room_id 
       WHERE b.user_id = ?`,
      [req.user.user_id]
    );

    const calendarData = bookings.map((booking) => ({
      id: booking.booking_id,
      room: booking.room_name,
      location: booking.location,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.status,
    }));

    res.status(200).json(calendarData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching calendar data", error: error.message });
  }
});

export default calendarRouter;
