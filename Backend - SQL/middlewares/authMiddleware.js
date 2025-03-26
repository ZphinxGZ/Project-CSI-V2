import jwt from "jsonwebtoken";
import connectDB from "../config/DB.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secure secret
    const connection = await connectDB();

    // Query user data from MySQL
    const [rows] = await connection.execute(
      "SELECT user_id, username, role FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = rows[0]; // Attach user to request object
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
