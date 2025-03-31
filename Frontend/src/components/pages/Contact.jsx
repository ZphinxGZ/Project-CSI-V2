import React, { useEffect, useState } from "react";
import "./Contact.css";

export const Contact = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // ตั้งค่าการแจ้งเตือนทันทีเมื่อโหลดหน้าเว็บ
    setNotifications([
      {
        text: "⏰ ถึงเวลาประชุม: ประชุมทีม เวลา 10:00 น. ชั้น 2 ห้อง A",
      },
      {
        text: "⏰ ถึงเวลาประชุม: ประชุมแผนก เวลา 14:00 น. ชั้น 3 ห้อง B",
      },
    ]);
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="contact-container">

      {/* แสดงข้อความเตือนเมื่อมีการประชุม */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((note, index) => (
            <div
              key={index}
              className="notification"
              onClick={() => handleNotificationClick(note)} // เปิด modal เมื่อคลิก
              style={{ cursor: "pointer" }}
            >
              {note.text}
            </div>
          ))}
        </div>
      )}

      {/* Modal สำหรับแสดงรายละเอียด */}
      {selectedNotification && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p>{selectedNotification.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};
