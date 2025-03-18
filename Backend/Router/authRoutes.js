import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

// Route for user registration
authRouter.post("/register", registerUser);

// Route for user login
authRouter.post("/login", loginUser);

export default authRouter;
