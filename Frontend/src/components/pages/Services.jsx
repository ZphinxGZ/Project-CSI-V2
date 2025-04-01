import React, { useState, useEffect } from "react";
import "./Services.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaStickyNote, FaDoorOpen } from "react-icons/fa";

export const Services = () => {
  const [filter, setFilter] = useState("ทั้งหมด");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking details
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:3456/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        const formattedBookings = response.data.map((booking) => ({
          id: booking.booking_id,
          room: booking.room_name,
          date: new Date(booking.start_time).toISOString().split("T")[0],
          startTime: booking.start_time,
          endTime: booking.end_time,
          status: "จองสำเร็จ", // Set default status to "จองสำเร็จ"
          color: "green", // Default color for "จองสำเร็จ"
        }));
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location]);

  // const handleFilterChange = (newFilter) => {
  //   setFilter(newFilter);
  //   navigate(`?filter=${newFilter}`);
  // };

  const filteredBookings =
    filter === "ทั้งหมด"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking); // Set the selected booking details
  };

  const closeDetailsModal = () => {
    setSelectedBooking(null); // Close the modal
  };

  return (
    <>
      <div className="page-title">
        <h2>&nbsp;รายการจองของฉัน</h2>
      </div>

      {/* <div className="filter-section">
        <label htmlFor="filter">กรองสถานะ:</label>
        <select
          className="filter"
          id="filter"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="จองสำเร็จ">จองสำเร็จ</option>
          <option value="จองไม่สำเร็จ">จองไม่สำเร็จ</option>
        </select>
      </div> */}

      <div className="booking-container">
        {filteredBookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <span className="room-name">{booking.room}</span>
            <span className="date">
              📆 วันที่จอง: {new Date(booking.date).toLocaleDateString("th-TH")}
            </span>
            <span className="reason">{booking.reason}</span>
            <button className="btn blue" onClick={() => handleViewDetails(booking)}>
              🔍 ดูรายละเอียด
            </button>
            <span className={`status ${booking.color}`}>{booking.status}</span>
          </div>
        ))}
      </div>

      {/* Modal for booking details */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📋 รายละเอียดการจอง</h3>
            <div className="modal-detail">
              <p><FaDoorOpen /> <strong>ห้อง:</strong> {selectedBooking.room}</p>
              <p><FaCalendarAlt /> <strong>วันที่:</strong> {new Date(selectedBooking.date).toLocaleDateString("th-TH")}</p>
              <p>
                <FaClock /> <strong>เวลา:</strong> {new Date(selectedBooking.startTime).toLocaleTimeString("th-TH")} - {new Date(selectedBooking.endTime).toLocaleTimeString("th-TH")}
              </p>
              
              <p><strong>สถานะ:</strong> <span className={`status ${selectedBooking.color}`}>{selectedBooking.status}</span></p>
            </div>
            <button className="btn red" onClick={closeDetailsModal}>ปิด</button>
          </div>
        </div>
      )}
    </>
  );
};