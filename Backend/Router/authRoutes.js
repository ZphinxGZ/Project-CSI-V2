import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

// Route for user registration
authRouter.post("/register", registerUser);

// Route for user login
authRouter.post("/login", loginUser);

// Route for user logout
//ถ้ามีปัญหาเรื่อง logout แล้วไม่เคลียร์ token ดูตรงนี้**
authRouter.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
