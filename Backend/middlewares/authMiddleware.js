import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secure secret
    const user = await User.findById(decoded.id).select("-password_hash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

// *************************ROLE ที่สามารถเพิ่มห้องประชุมได้****************************************
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
// *************************ROLE ที่สามารถเพิ่มห้องประชุมได้****************************************
