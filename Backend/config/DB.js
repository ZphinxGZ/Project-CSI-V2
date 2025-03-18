import mongoose from "mongoose";

// ฟังก์ชันสำหรับเชื่อมต่อ MongoDB
const connectDB = async () => {
  try {
    // URI สำหรับเชื่อมต่อ MongoDB Atlas
    const uri = "mongodb+srv://Oxygenn:teeraphan200479@cluster0.q2lf0.mongodb.net/MeetingRoomBooking?retryWrites=true&w=majority";
    
    // เชื่อมต่อ MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // ออกจากกระบวนการด้วยสถานะผิดพลาด
  }
};

// ส่งออกฟังก์ชัน connectDB
export default connectDB;