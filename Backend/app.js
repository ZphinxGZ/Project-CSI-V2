import express from "express";
import cors from "cors";
import mysql from "mysql2";
import morgan from "morgan";

// const host = "192.168.1.14";
const port = 3700;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined")); // Add morgan middleware for logging

const config = {
  user: "root",
  password: "root",
  host: "25.32.51.163",
  port: 3400,
  database: "meetingroombooking",
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Happy Birthday, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
