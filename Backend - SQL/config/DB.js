import mysql from "mysql2/promise";

// ฟังก์ชันสำหรับเชื่อมต่อ MySQL
const connectDB = async () => {
  try {
    // การตั้งค่าการเชื่อมต่อ MySQL
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
    process.exit(1); // ออกจากกระบวนการด้วยสถานะผิดพลาด
  }
};

// ส่งออกฟังก์ชัน connectDB
export default connectDB;