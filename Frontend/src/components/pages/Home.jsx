import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import "./Home.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

export const Home = () => {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear() + 543); // แปลงเป็น พ.ศ.
  const [days, setDays] = useState([]);
  const [calendarData, setCalendarData] = useState([]); // State for API data

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  useEffect(() => {
    fetchCalendarData(); // Fetch API data on component mount
  }, []);

  useEffect(() => {
    renderDates();
  }, [currentMonth, currentYear, calendarData]);

  const fetchCalendarData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get("http://localhost:3456/api/calendar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendarData(response.data); // Store API data in state
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const renderDates = () => {
    const firstDay = new Date(currentYear - 543, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear - 543, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear - 543, currentMonth, 0).getDate();

    let newDays = [];

    // วันก่อนหน้าเดือนนี้
    for (let i = firstDay - 1; i >= 0; i--) {
      newDays.push({ 
        day: prevLastDate - i, 
        type: "prev-month" 
      });
    }

    // วันในเดือนนี้
    for (let i = 1; i <= lastDate; i++) {
      const dateKey = `${currentYear - 543}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const events = calendarData.filter(event => event.startTime.startsWith(dateKey));
      newDays.push({
        day: i,
        type: "current-month",
        isToday: new Date().getDate() === i && new Date().getMonth() === currentMonth && new Date().getFullYear() + 543 === currentYear,
        events: events.length > 0 ? events : null
      });
    }

    // วันถัดไปเดือนหน้า
    const nextDays = 42 - newDays.length;
    for (let i = 1; i <= nextDays; i++) {
      newDays.push({
        day: i,
        type: "next-month"
      });
    }

    setDays(newDays);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(prev => prev - 1);
            } else {
              setCurrentMonth(prev => prev - 1);
            }
          }}
        >
          <FaChevronLeft /> {/* Add left icon */}
          ก่อนหน้า
        </button>

        <h3>{monthNames[currentMonth]} {currentYear}</h3>

        <button 
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(prev => prev + 1);
            } else {
              setCurrentMonth(prev => prev + 1);
            }
          }}
        >
          ถัดไป
          <FaChevronRight /> {/* Add right icon */}
        </button>
      </div>

      <div className="calendar-days">
        <div className="day">อา.</div>
        <div className="day">จ.</div>
        <div className="day">อ.</div>
        <div className="day">พ.</div>
        <div className="day">พฤ.</div>
        <div className="day">ศ.</div>
        <div className="day">ส.</div>

        {days.map((d, index) => (
          <div 
            key={index} 
            className={`date ${d.type} ${d.isToday ? "highlight-today" : ""}`}
          >
            {d.day}
            {d.events && d.events.map((event, idx) => (
              <div key={idx} className="event">
                <span className="time">{new Date(event.startTime).toLocaleTimeString()}</span>
                <span className="room">{event.room}</span>
                <span className="location">{event.location}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
