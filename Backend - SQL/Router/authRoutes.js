import express from "express";
import cors from "cors";
import { registerUser, loginUser, changePassword, deleteAccount } from "../controllers/authController.js";

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
