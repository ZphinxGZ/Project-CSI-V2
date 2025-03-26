import express from "express";
import cors from "cors"; // ✅ เพิ่ม CORS
import { registerUser, loginUser } from "../controllers/authController.js";

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

export default authRouter;
