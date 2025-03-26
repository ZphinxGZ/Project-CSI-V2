import express from "express";
import cors from "cors";
// import { Room } from "../models/Room.js"; // Adjusted to use Sequelize model
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const roomRouter = express.Router();
roomRouter.use(cors());
roomRouter.use(express.json({ limit: '50mb' }));
roomRouter.use(express.urlencoded({ limit: '50mb', extended: true }));

roomRouter.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { room_name, capacity, location, description } = req.body;

    // Check if a room with the same name already exists
    const existingRoom = await Room.findOne({ where: { room_name } });
    if (existingRoom) {
      return res.status(400).json({ message: "Room name already exists" });
    }

    // Create a new room
    const newRoom = await Room.create({
      room_name,
      capacity,
      location,
      description,
    });

    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
});

roomRouter.get("/", async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.findAll();
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});

roomRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find a room by ID
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details", error: error.message });
  }
});

roomRouter.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, location, description } = req.body;

    // Find and update the room
    const [updated] = await Room.update(
      { room_name: name, capacity, location, description },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedRoom = await Room.findByPk(id);
    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
});

roomRouter.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the room by ID
    const deleted = await Room.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
});

export default roomRouter;
