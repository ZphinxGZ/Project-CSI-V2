import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ผู้ใช้ที่เกี่ยวข้อง
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // การจองที่เกี่ยวข้อง
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // ห้องที่เกี่ยวข้อง
  message: { type: String, required: true }, // ข้อความแจ้งเตือน
  is_read: { type: Boolean, default: false }, // สถานะการอ่าน
  created_at: { type: Date, default: Date.now }, // วันที่สร้างการแจ้งเตือน
});

export default mongoose.model("Notification", notificationSchema);      