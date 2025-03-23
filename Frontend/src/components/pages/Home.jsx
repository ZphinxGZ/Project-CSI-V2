import React, { useState, useEffect } from "react";
import "./Home.css";

export const Home = () => {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear() + 543); // แปลงเป็น พ.ศ.
  const [days, setDays] = useState([]);

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const meetings = {
    "2568-03-05": { time: "10:00 น.", room: "ห้องประชุม A", location: "ชั้น 1" },
    "2568-03-12": { time: "14:00 น.", room: "ห้องประชุม B", location: "ชั้น 2" },
    "2568-03-20": { time: "09:00 น.", room: "ห้องประชุม C", location: "ชั้น 3" },
    "2568-04-01": { time: "13:00 น.", room: "ห้องประชุม D", location: "ชั้น 4" }
  };

  useEffect(() => {
    renderDates();
  }, [currentMonth, currentYear]);

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
      let dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      newDays.push({
        day: i,
        type: "current-month",
        isToday: new Date().getDate() === i && new Date().getMonth() === currentMonth && new Date().getFullYear() + 543 === currentYear,
        meeting: meetings[dateKey] || null
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
            {d.meeting && (
              <div className="meeting">
                <span className="time">{d.meeting.time}</span>
                <span className="room">{d.meeting.room}</span>
                <span className="location">{d.meeting.location}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
