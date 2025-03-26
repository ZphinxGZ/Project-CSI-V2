import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const bookingRouter = express.Router();

bookingRouter.post("/", authenticate, async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only users and admins can book rooms." });
    }

    const [overlappingBooking] = await connectDB.query(
      `SELECT * FROM bookings WHERE room_id = ? AND (
        (start_time < ? AND start_time >= ?) OR
        (end_time > ? AND end_time <= ?) OR
        (start_time <= ? AND end_time >= ?)
      )`,
      [roomId, endTime, startTime, startTime, endTime, startTime, endTime]
    );

    if (overlappingBooking.length > 0) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    const [result] = await connectDB.query(
      `INSERT INTO bookings (user_id, room_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, roomId, startTime, endTime, "pending"]
    );

    res.status(201).json({ message: "Booking created successfully", bookingId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});

bookingRouter.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const [bookings] = await connectDB.query(
      `SELECT b.*, u.username, r.room_name, r.location 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       JOIN rooms r ON b.room_id = r.id`
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

bookingRouter.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role === "user" && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: "Access denied. You can only view your own bookings." });
    }

    const [bookings] = await connectDB.query(
      `SELECT b.*, r.room_name, r.location 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = ?`,
      [userId]
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
});

bookingRouter.get("/calendar", authenticate, async (req, res) => {
  try {
    const [bookings] = await connectDB.query(
      `SELECT b.*, r.room_name, r.location 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = ?`,
      [req.user.id]
    );

    const calendarData = bookings.map((booking) => ({
      id: booking.id,
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

bookingRouter.get("/room/:roomId", authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const [bookings] = await connectDB.query(
      `SELECT b.*, u.username, r.room_name, r.location 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.room_id = ?`,
      [roomId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this room" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room bookings", error: error.message });
  }
});

bookingRouter.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Only users can update bookings." });
    }

    const [booking] = await connectDB.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only update your own bookings." });
    }

    const [overlappingBooking] = await connectDB.query(
      `SELECT * FROM bookings WHERE room_id = ? AND id != ? AND (
        (start_time < ? AND start_time >= ?) OR
        (end_time > ? AND end_time <= ?) OR
        (start_time <= ? AND end_time >= ?)
      )`,
      [booking[0].room_id, id, endTime, startTime, startTime, endTime, startTime, endTime]
    );

    if (overlappingBooking.length > 0) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    await connectDB.query(
      `UPDATE bookings SET start_time = ?, end_time = ? WHERE id = ?`,
      [startTime, endTime, id]
    );

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
});

bookingRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const [booking] = await connectDB.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only cancel your own bookings." });
    }

    await connectDB.query(`DELETE FROM bookings WHERE id = ?`, [id]);

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error: error.message });
  }
});

bookingRouter.get("/reports", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const [bookings] = await connectDB.query(
      `SELECT b.*, r.room_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id`
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

export default bookingRouter;
