import React, { useState, useEffect } from "react";
import "./Services.css";
import { useLocation, useNavigate } from "react-router-dom";

export const Services = () => {
  const [filter, setFilter] = useState("ทั้งหมด");
  const location = useLocation();
  const navigate = useNavigate();

  // ข้อมูลตัวอย่าง (เพิ่ม date ให้ครบทุกอัน)
  const bookings = [
    { id: 1, room: "ห้องประชุม 1", date: "2024-03-20", status: "อนุมัติ", reason: "Project discussion", color: "green" },
    { id: 2, room: "ห้องประชุม 2", date: "2024-03-18", status: "ไม่อนุมัติ", reason: "Training session", color: "red" },
    { id: 3, room: "ห้องประชุม 3", date: "2024-03-19", status: "รอตรวจสอบ", reason: "Client meeting", color: "orange" },
    { id: 4, room: "ห้องประชุม 3", date: "2024-03-17", status: "อนุมัติ", reason: "Team meeting", color: "green" },
    { id: 5, room: "ห้องประชุม 2", date: "2024-03-16", status: "ไม่อนุมัติ", reason: "Product launch", color: "red" },
    { id: 6, room: "ห้องประชุม 1", date: "2024-03-15", status: "รอตรวจสอบ", reason: "Interview", color: "orange" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    navigate(`?filter=${newFilter}`);
  };

  // คัดกรองข้อมูล
  const filteredBookings = filter === "ทั้งหมด"
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  return (
    <>
      <div className="page-title">
        <h2>&nbsp;รายการจองของฉัน</h2>
      </div>
      
      <div className="booking-container">
  {filteredBookings.map((booking) => (
    <div className="booking-card" key={booking.id}>
      <span className="room-name">{booking.room}</span>
      <span className="date">📆 วันที่จอง: {new Date(booking.date).toLocaleDateString("th-TH")}</span>
      <span className="reason">📝 {booking.reason}</span>
      <button className="btn blue">🔍 ดูรายละเอียด</button>
      <span className={`status ${booking.color}`}>{booking.status}</span>
    </div>
  ))}
</div>
    </>
  );
};