import express from "express";
import cors from "cors"; // ✅ เพิ่ม CORS
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.use(cors({
  origin: "*",
  methods: ["POST"],
  credentials: true
}));

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

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
 *                 enum: [user, admin]
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
 *     summary: Log in a user
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

// Route for user registration
authRouter.post("/register", registerUser);

// Route for user login
authRouter.post("/login", loginUser);

// Route for user logout
authRouter.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
