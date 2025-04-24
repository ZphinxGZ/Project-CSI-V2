import express from "express";
import cors from "cors";
import multer from "multer"; // Import multer for file uploads
import path from "path";
import connectDB from "../config/DB.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

const roomRouter = express.Router();
roomRouter.use(cors());
roomRouter.use(express.json({ limit: "50mb" }));
roomRouter.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/rooms/:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 *       404:
 *         description: No rooms found
 *       500:
 *         description: Server error
 */
roomRouter.get("/", async (req, res) => {
  try {
    const connection = await connectDB();

    const [rooms] = await connection.execute("SELECT * FROM rooms");
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});

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
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
roomRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();

    const [room] = await connection.execute("SELECT * FROM rooms WHERE room_id = ?", [id]);
    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details", error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/:
 *   post:
 *     summary: Create a new room (admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               room_name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Room name already exists
 *       500:
 *         description: Server error
 */
roomRouter.post("/", authenticate, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { room_name, capacity, location, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

    const connection = await connectDB();

    const [existingRoom] = await connection.execute(
      "SELECT * FROM rooms WHERE room_name = ?",
      [room_name]
    );
    if (existingRoom.length > 0) {
      return res.status(400).json({ message: "Room name already exists" });
    }

    await connection.execute(
      "INSERT INTO rooms (room_name, capacity, location, description, image_url) VALUES (?, ?, ?, ?, ?)",
      [room_name, capacity, location, description, image_url]
    );

    res.status(201).json({ message: "Room created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
});

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
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               room_name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
roomRouter.put("/:id", authenticate, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { room_name, capacity, location, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

    const connection = await connectDB();

    const [existingRoom] = await connection.execute("SELECT * FROM rooms WHERE room_id = ?", [id]);
    if (existingRoom.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const [result] = await connection.execute(
      "UPDATE rooms SET room_name = ?, capacity = ?, location = ?, description = ?, image_url = COALESCE(?, image_url) WHERE room_id = ?",
      [room_name, capacity, location, description, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
});

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
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
roomRouter.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();

    const [result] = await connection.execute("DELETE FROM rooms WHERE room_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
});

export default roomRouter;
