import express from "express";
import cors from "cors"; // Add this line
import Room from "../models/Room.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const roomRouter = express.Router();
roomRouter.use(cors()); // Add this line

// Increase payload size limit
roomRouter.use(express.json({ limit: '50mb' }));
roomRouter.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management routes
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 *       404:
 *         description: No rooms found
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room details by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Add a new room (admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_name:
 *                 type: string
 *               capacity:
 *                 type: number
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Room name already exists
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update room details (admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: number
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room (admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */

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

// API สำหรับดึงข้อมูลห้องประชุมทั้งหมด
roomRouter.get("/", async (req, res) => {
  try {
    // ดึงข้อมูลห้องประชุมทั้งหมดจากฐานข้อมูล
    const rooms = await Room.find({});
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});

// API สำหรับดึงข้อมูลห้องประชุมตาม ID
roomRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาห้องประชุมตาม ID
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details", error: error.message });
  }
});

// API สำหรับอัปเดตข้อมูลห้องประชุม (เฉพาะ admin)
roomRouter.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, location, description } = req.body;

    // ค้นหาและอัปเดตข้อมูลห้องประชุม
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { room_name: name, capacity, location, description },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message }); // Fixed syntax error
  }
});

// API สำหรับลบห้องประชุม (เฉพาะ admin)
roomRouter.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // ลบห้องประชุมตาม ID
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
});

export default roomRouter;
