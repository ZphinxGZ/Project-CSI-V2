import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../config/DB.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const connection = await connectDB();

    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.execute(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "user"]
    );

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const connection = await connectDB();

    const [users] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret");
    const connection = await connectDB();

    const [users] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [decoded.user_id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashedPassword, decoded.user_id]
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret");
    const connection = await connectDB();

    const [users] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [decoded.user_id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await connection.execute(
      "DELETE FROM users WHERE user_id = ?",
      [decoded.user_id]
    );

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};
