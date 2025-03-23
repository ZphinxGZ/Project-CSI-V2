import express from "express";
import Booking from "../models/Booking.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const bookingRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management routes
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Room is already booked for the selected time
 */

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

// API สำหรับดึงข้อมูลการจองทั้งหมด (เฉพาะ admin)
bookingRouter.get("/", authenticate, async (req, res) => {
  try {
    // ตรวจสอบว่า role ของผู้ใช้เป็น admin เท่านั้น
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ดึงข้อมูลการจองทั้งหมด
    const bookings = await Booking.find({})
      .populate("user_id", "username")
      .populate("room_id", "room_name location");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
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

// API สำหรับดึงข้อมูลการจองของห้องประชุม (เฉพาะ admin)
bookingRouter.get("/room/:roomId", authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;

    // ตรวจสอบว่า role ของผู้ใช้เป็น admin เท่านั้น
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ดึงข้อมูลการจองของห้องประชุม
    const bookings = await Booking.find({ room_id: roomId })
      .populate("user_id", "username")
      .populate("room_id", "room_name location");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this room" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room bookings", error: error.message });
  }
});

// API สำหรับอัปเดตข้อมูลการจอง (เฉพาะ user)
bookingRouter.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    // ตรวจสอบว่า role ของผู้ใช้เป็น user เท่านั้น
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Only users can update bookings." });
    }

    // ค้นหาการจองที่ต้องการอัปเดต
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจอง
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only update your own bookings." });
    }

    // ตรวจสอบว่ามีการจองห้องในช่วงเวลาที่ทับซ้อนกันหรือไม่
    const overlappingBooking = await Booking.findOne({
      room_id: booking.room_id,
      _id: { $ne: id }, // ยกเว้นการจองปัจจุบัน
      $or: [
        { start_time: { $lt: endTime, $gte: startTime } },
        { end_time: { $gt: startTime, $lte: endTime } },
        { start_time: { $lte: startTime }, end_time: { $gte: endTime } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    // อัปเดตข้อมูลการจอง
    booking.start_time = startTime;
    booking.end_time = endTime;
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
});

// API สำหรับยกเลิกการจอง (เฉพาะ user และ admin แต่ต้องเป็นการจองของตัวเอง)
bookingRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาการจองที่ต้องการยกเลิก
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจอง
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only cancel your own bookings." });
    }

    // ลบการจอง
    await booking.deleteOne();

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error: error.message });
  }
});

// API สำหรับดึงข้อมูลปฏิทินการจองของผู้ใช้ที่ล็อกอิน
bookingRouter.get("/calendar", authenticate, async (req, res) => {
  try {
    // ดึงข้อมูลการจองของผู้ใช้ที่ล็อกอิน
    const bookings = await Booking.find({ user_id: req.user._id })
      .populate("room_id", "room_name location");

    // จัดรูปแบบข้อมูลสำหรับปฏิทิน
    const calendarData = bookings.map((booking) => ({
      id: booking._id,
      room: booking.room_id.room_name,
      location: booking.room_id.location,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.status,
    }));

    res.status(200).json(calendarData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching calendar data", error: error.message });
  }
});

// GET /api/bookings/reports: Fetch booking statistics
bookingRouter.get("/reports", authenticate, async (req, res) => {
  try {
    // ตรวจสอบว่า role ของผู้ใช้เป็น admin เท่านั้น
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ดึงข้อมูลการจองทั้งหมด
    const bookings = await Booking.find({}).populate("room_id", "room_name");

    // กรองเฉพาะการจองที่มี room_id ที่ถูกต้อง
    const validBookings = bookings.filter((booking) => booking.room_id);

    // สถิติ: จำนวนการจองต่อวัน
    const bookingsPerDay = validBookings.reduce((acc, booking) => {
      const date = booking.start_time.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // สถิติ: ห้องประชุมที่ถูกจองบ่อยที่สุด
    const roomBookings = validBookings.reduce((acc, booking) => {
      const roomName = booking.room_id.room_name;
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
