import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const bookingRouter = express.Router();

bookingRouter.post("/", authenticate, async (req, res) => {
  try {
    const { room_id, startTime, endTime } = req.body;

    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only users and admins can book rooms." });
    }

    const connection = await connectDB(); // สร้างการเชื่อมต่อ MySQL

    // ตรวจสอบว่าห้องถูกจองในช่วงเวลาที่เลือกหรือไม่
    const [overlappingBooking] = await connection.execute(
      `SELECT * FROM bookings WHERE room_id = ? AND (
        (start_time < ? AND start_time >= ?) OR
        (end_time > ? AND end_time <= ?) OR
        (start_time <= ? AND end_time >= ?)
      )`,
      [room_id, endTime, startTime, startTime, endTime, startTime, endTime]
    );

    if (overlappingBooking.length > 0) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    // เพิ่มการจองใหม่
    const [result] = await connection.execute(
      `INSERT INTO bookings (user_id, room_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)`,
      [req.user.user_id, room_id, startTime, endTime, "pending"]
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

    const connection = await connectDB();

    const [bookings] = await connection.execute(
      `SELECT b.*, u.username, r.room_name, r.location 
       FROM bookings b 
       JOIN users u ON b.user_id = u.user_id 
       JOIN rooms r ON b.room_id = r.room_id`
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

    const connection = await connectDB();

    const [bookings] = await connection.execute(
      `SELECT b.*, r.room_name, r.location 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.room_id 
       WHERE b.user_id = ?`,
      [userId]
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
});

bookingRouter.get("/user", authenticate, async (req, res) => {
  try {
    const connection = await connectDB(); 

    const query = `
      SELECT bookings.*, rooms.room_name
      FROM bookings
      INNER JOIN rooms ON bookings.room_id = rooms.room_id
      WHERE bookings.user_id = ?
      ORDER BY bookings.created_at DESC
    `;
    const [bookings] = await connection.execute(query, [req.user.user_id]);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No booking history found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking history", error: error.message });
  }
});

bookingRouter.get("/room/:roomId", authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const connection = await connectDB();

    const [bookings] = await connection.execute(
      `SELECT b.*, u.username, r.room_name, r.location 
       FROM bookings b 
       JOIN users u ON b.user_id = u.user_id 
       JOIN rooms r ON b.room_id = r.room_id 
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

    const connection = await connectDB();

    const [booking] = await connection.execute(`SELECT * FROM bookings WHERE booking_id = ?`, [id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: "Access denied. You can only update your own bookings." });
    }

    const [overlappingBooking] = await connection.execute(
      `SELECT * FROM bookings WHERE room_id = ? AND booking_id != ? AND (
        (start_time < ? AND start_time >= ?) OR
        (end_time > ? AND end_time <= ?) OR
        (start_time <= ? AND end_time >= ?)
      )`,
      [booking[0].room_id, id, endTime, startTime, startTime, endTime, startTime, endTime]
    );

    if (overlappingBooking.length > 0) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    await connection.execute(
      `UPDATE bookings SET start_time = ?, end_time = ? WHERE booking_id = ?`,
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

    const connection = await connectDB(); 

    const [booking] = await connection.execute(`SELECT * FROM bookings WHERE booking_id = ?`, [id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: "Access denied. You can only cancel your own bookings." });
    }

    await connection.execute(`DELETE FROM bookings WHERE booking_id = ?`, [id]);

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error: error.message });
  }
});

export default bookingRouter;
