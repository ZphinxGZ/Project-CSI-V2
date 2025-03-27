import mysql from "mysql2/promise";

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "MeetingRoomBooking",
    });

    console.log("Connected to MySQL database");
    return connection; // ส่งคืนการเชื่อมต่อ
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    process.exit(1);
  }
};

export default connectDB;