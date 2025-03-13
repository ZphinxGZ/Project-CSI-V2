import express from 'express';
import cors from 'cors';
import mysql from "mysql2";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());


const config = {
  user: "root",
  password: "root",
  host: "localhost",
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});