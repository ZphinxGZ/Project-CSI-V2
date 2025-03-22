import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa"; // Import the icon
import "./Contact.css"; // Import the CSS file

export const Contact = () => {
  const [notifications, setNotifications] = useState([]);
  const meetings = [
    { date: "2023-03-05T10:00:00", title: "ประชุมทีม" },
    { date: "2023-03-12T14:00:00", title: "ประชุมแผนก" },
    { date: "2023-03-20T09:00:00", title: "ประชุมผู้บริหาร" },
  ];

  useEffect(() => {
    const checkMeetings = () => {
      const now = new Date();
      meetings.forEach((meeting) => {
        const meetingTime = new Date(meeting.date);
        const diff = meetingTime - now;
        if (diff > 0 && diff <= 15 * 60 * 1000) { // Notify 15 minutes before
          setNotifications((prev) => [
            ...prev,
            `ใกล้ถึงเวลาประชุม: ${meeting.title} เวลา ${meetingTime.toLocaleTimeString()}`,
          ]);
        }
      });
    };

    const interval = setInterval(checkMeetings, 60 * 1000); // Check every minute
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const storedNotification = localStorage.getItem("bookingNotification");
    if (storedNotification) {
      setNotifications([storedNotification]);
      localStorage.removeItem("bookingNotification"); // Clear after displaying
    }
  }, []);

  return (
    <div className="contact-container">
      <h1><FaBell /> แจ้งเตือน</h1>
      <p>แจ้งเตือนเมื่อใกล้ถึงเวลาประชุม</p>
      <div className="notifications">
        {notifications.map((note, index) => (
          <div key={index} className="notification">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};
