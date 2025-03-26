import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ผู้ใช้ที่จอง
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // ห้องประชุมที่จอง
  start_time: { type: Date, required: true }, // เวลาเริ่มต้นการจอง
  end_time: { type: Date, required: true }, // เวลาสิ้นสุดการจอง
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // สถานะการจอง
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // ผู้ที่อนุมัติการจอง
  approved_at: { type: Date, default: null }, // วันที่อนุมัติการจอง
  created_at: { type: Date, default: Date.now }, // วันที่สร้างการจอง
});

export default mongoose.model("Booking", bookingSchema);