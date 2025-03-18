import express from "express";
import Room from "../models/Room.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const roomRouter = express.Router();

// API สำหรับเพิ่มห้องประชุมใหม่ (เฉพาะ admin)
roomRouter.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { room_name, capacity, location, description } = req.body;

    // ตรวจสอบว่ามีห้องประชุมชื่อเดียวกันอยู่แล้วหรือไม่
    const existingRoom = await Room.findOne({ room_name });
    if (existingRoom) {
      return res.status(400).json({ message: "Room name already exists" });
    }

    // สร้างห้องประชุมใหม่
    const newRoom = new Room({
      room_name,
      capacity,
      location,
      description,
    });

    // บันทึกห้องประชุมลงฐานข้อมูล
    await newRoom.save();

    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
});

export default roomRouter;
