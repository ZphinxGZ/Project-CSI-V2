import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import connectDB from "../config/DB.js";

const notificationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /api/notifications/:
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
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500:
 *         description: Server error
 */
notificationRouter.post("/", authenticate, async (req, res) => {
  try {
    const { booking_id, room_id, message } = req.body;

    const connection = await connectDB();

    const query = `
      INSERT INTO notifications (user_id, booking_id, room_id, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [req.user.user_id, booking_id, room_id, message, false]; // เพิ่ม is_read เป็น false

    await connection.execute(query, values); // ใช้ connection.execute แทน connectDB.execute

    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/:
 *   get:
 *     summary: Get all notifications for the current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       404:
 *         description: No notifications found
 *       500:
 *         description: Server error
 */
notificationRouter.get("/", authenticate, async (req, res) => {
  try {
    const connection = await connectDB();

    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [notifications] = await connection.execute(query, [req.user.user_id]); // ใช้ connection.execute แทน connectDB.execute

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found or not authorized
 *       500:
 *         description: Server error
 */
notificationRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await connectDB(); // สร้างการเชื่อมต่อ MySQL

    const query = `
      DELETE FROM notifications
      WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await connection.execute(query, [id, req.user.user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found or not authorized
 *       500:
 *         description: Server error
 */
notificationRouter.put("/:id/read", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await connectDB(); // สร้างการเชื่อมต่อ MySQL

    const query = `
      UPDATE notifications
      SET is_read = 1
      WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await connection.execute(query, [id, req.user.user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found or not authorized to update" });
    }

    res.status(200).json({ message: "Notification status updated to true successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification status", error: error.message });
  }
});

export default notificationRouter;
