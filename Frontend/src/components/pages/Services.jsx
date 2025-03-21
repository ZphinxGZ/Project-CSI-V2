import React, { useState, useEffect } from "react";
import "./Services.css";
import { useLocation, useNavigate } from "react-router-dom";

export const Services = () => {
  const [filter, setFilter] = useState("ทั้งหมด");
  const location = useLocation();
  const navigate = useNavigate();

  // แปลงสถานะให้เป็น "จองสำเร็จ" / "จองไม่สำเร็จ"
  const bookings = [
    { id: 1, room: "ห้องประชุม 1", date: "2024-03-20", status: "จองสำเร็จ", reason: "Project discussion", color: "green" },
    { id: 2, room: "ห้องประชุม 2", date: "2024-03-18", status: "จองไม่สำเร็จ", reason: "Training session", color: "red" },
    { id: 3, room: "ห้องประชุม 3", date: "2024-03-19", status: "จองสำเร็จ", reason: "Client meeting", color: "green" },
    { id: 4, room: "ห้องประชุม 3", date: "2024-03-17", status: "จองสำเร็จ", reason: "Team meeting", color: "green" },
    { id: 5, room: "ห้องประชุม 2", date: "2024-03-16", status: "จองไม่สำเร็จ", reason: "Product launch", color: "red" },
    { id: 6, room: "ห้องประชุม 1", date: "2024-03-15", status: "จองไม่สำเร็จ", reason: "Interview", color: "red" },
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

  const filteredBookings =
    filter === "ทั้งหมด"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <>
      <div className="page-title">
        <h2>&nbsp;รายการจองของฉัน</h2>
      </div>

      <div className="filter-section">
        <label htmlFor="filter">กรองสถานะ:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="จองสำเร็จ">จองสำเร็จ</option>
          <option value="จองไม่สำเร็จ">จองไม่สำเร็จ</option>
        </select>
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