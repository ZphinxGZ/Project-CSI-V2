import express from "express";
import Booking from "../models/Booking.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const bookingRouter = express.Router();

// API สำหรับจองห้องประชุม (เฉพาะ user และ admin)
bookingRouter.post("/", authenticate, async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    // ตรวจสอบว่า role ของผู้ใช้เป็น user หรือ admin เท่านั้น
    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only users and admins can book rooms." });
    }

    // ตรวจสอบว่ามีการจองห้องในช่วงเวลาที่ทับซ้อนกันหรือไม่
    const overlappingBooking = await Booking.findOne({
      room_id: roomId,
      $or: [
        { start_time: { $lt: endTime, $gte: startTime } },
        { end_time: { $gt: startTime, $lte: endTime } },
        { start_time: { $lte: startTime }, end_time: { $gte: endTime } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    // สร้างการจองใหม่
    const newBooking = new Booking({
      user_id: req.user._id,
      room_id: roomId,
      start_time: startTime,
      end_time: endTime,
      status: "pending", // กำหนดค่า default เป็น pending
    });

    // บันทึกการจองลงฐานข้อมูล
    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});

// API สำหรับดึงข้อมูลการจองของผู้ใช้ (เฉพาะ user และ admin)
bookingRouter.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // ตรวจสอบว่า role ของผู้ใช้เป็น user หรือ admin
    if (req.user.role === "user" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied. You can only view your own bookings." });
    }

    // ดึงข้อมูลการจองของผู้ใช้
    const bookings = await Booking.find({ user_id: userId }).populate("room_id", "room_name location");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
});

export default bookingRouter;
