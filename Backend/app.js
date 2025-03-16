import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./connectDatabase/connectDB.js"; // Import MongoDB connection

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined")); // Add morgan middleware for logging

// Connect to MongoDB
connectDB();

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Happy Birthday, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
