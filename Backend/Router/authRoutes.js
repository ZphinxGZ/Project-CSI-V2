import express from "express";
import cors from "cors"; // ✅ เพิ่ม CORS
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.use(cors({
  origin: "*",
  methods: ["POST"],
  credentials: true
}));

// Route for user registration
authRouter.post("/register", registerUser);

// Route for user login
authRouter.post("/login", loginUser);

// Route for user logout
authRouter.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
