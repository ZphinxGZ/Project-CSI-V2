import express from "express";
import Notification from "../models/Notification.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: string
 *               room_id:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500:
 *         description: Error creating notification
 */
notificationRouter.post("/", authenticate, async (req, res) => {
  try {
    const { booking_id, room_id, message } = req.body;

    const newNotification = new Notification({
      user_id: req.user._id,
      booking_id,
      room_id,
      message,
      created_at: new Date(),
    });

    await newNotification.save();

    res.status(201).json({ message: "Notification created successfully", notification: newNotification });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Fetch notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       404:
 *         description: No notifications found
 *       500:
 *         description: Error fetching notifications
 */
notificationRouter.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id }).sort({ created_at: -1 });

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

export default notificationRouter;
