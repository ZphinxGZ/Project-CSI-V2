import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Home.css";

export const Home = () => {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear() + 543); // แปลงเป็น พ.ศ.
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  const meetings = {
    "2568-03-05": "10:00 น.",
    "2568-03-12": "14:00 น.",
    "2568-03-20": "09:00 น.",
    "2568-04-01": "13:00 น."
  };

  const updateCalendar = () => {
    document.getElementById("calendarTitle").textContent = `${monthNames[currentMonth]} ${currentYear}`;
    renderDates();
  };

  const renderDates = () => {
    const calendarDays = document.getElementById("calendarDays");
    calendarDays.innerHTML = `
      <div class="day">อา.</div>
      <div class="day">จ.</div>
      <div class="day">อ.</div>
      <div class="day">พ.</div>
      <div class="day">พฤ.</div>
      <div class="day">ศ.</div>
      <div class="day">ส.</div>
    `;
    
    const firstDay = new Date(currentYear - 543, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear - 543, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear - 543, currentMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.innerHTML += `<div class="date prev-month">${prevLastDate - i}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
      let dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      let meetingInfo = meetings[dateKey] ? `<div class="meeting">${meetings[dateKey]}</div>` : "";
      let isToday = new Date().getDate() === i && new Date().getMonth() === currentMonth && new Date().getFullYear() + 543 === currentYear;
      calendarDays.innerHTML += `<div class="date ${isToday ? 'highlight-today' : ''}">${i}${meetingInfo}</div>`;
    }

    const nextDays = 42 - calendarDays.children.length;
    for (let i = 1; i <= nextDays; i++) {
      calendarDays.innerHTML += `<div class="date next-month">${i}</div>`;
    }
  };

  useEffect(() => {
    updateCalendar();
  }, [currentMonth, currentYear]);

  return (
    <div>
      <div className="container">
        <div className="header">
          <i className="bi bi-list"></i>
          <h2>Dashboard</h2>
        </div>
        
        <div className="dashboard-grid">
          <div className=" card green">ห้อง อนุมัติ </div>
          <div className="card red">ห้อง ไม่อนุมัติ </div>
          <div className="card orange">ห้อง รอตรวจสอบ</div>
          <div className=" card blue">ห้องทั้งหมด </div>
        </div>
        
        <div className="calendar">
          <div className="calendar-header">
            <button id="prevMonth" onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1);
              } else {
                setCurrentMonth(prev => prev - 1);
              }
            }}>ก่อนหน้า </button>

            <h3 id="calendarTitle">{monthNames[currentMonth]} {currentYear}</h3>

            <button id="nextMonth" onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1);
              } else {
                setCurrentMonth(prev => prev + 1);
              }
            }}>ถัดไป</button>
          </div>
          <div className="calendar-days" id="calendarDays">
            <div className="day">อา.</div>
            <div className="day">จ.</div>
            <div className="day">อ.</div>
            <div className="day">พ.</div>
            <div className="day">พฤ.</div>
            <div className="day">ศ.</div>
            <div className="day">ส.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
