import express from "express";
import cors from "cors"; // ✅ เพิ่ม CORS
import { registerUser, loginUser, changePassword, deleteAccount } from "../controllers/authController.js";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid request
 */

const authRouter = express.Router();

authRouter.use(cors({
  origin: "*",
  methods: ["POST"],
  credentials: true
}));

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

authRouter.post("/change-password", changePassword);

authRouter.delete("/delete-account", deleteAccount);

export default authRouter;
