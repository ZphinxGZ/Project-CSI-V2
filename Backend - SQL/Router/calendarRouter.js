import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const calendarRouter = express.Router();

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
