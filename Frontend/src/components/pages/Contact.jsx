import React, { useEffect, useState } from "react";
import "./Contact.css";

export const Contact = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // ตั้งค่าการแจ้งเตือนทันทีเมื่อโหลดหน้าเว็บ
    setNotifications([
      {
        id: 1,
        text: " ถึงเวลาประชุม: ประชุมทีม เวลา 10:00 น. ชั้น 2 ห้อง A",
        read: false,
      },
      {
        id: 2,
        text: " ถึงเวลาประชุม: ประชุมแผนก เวลา 14:00 น. ชั้น 3 ห้อง B",
        read: false,
      },
    ]);
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, read: true } : note
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contact-container">

      {/* แสดงข้อความเตือนเมื่อมีการประชุม */}
      {notifications.length > 0 ? (
        <div className="notifications">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="notification"
              onClick={() => handleNotificationClick(note.id)} // เปิด modal เมื่อคลิก
              style={{
                cursor: "pointer",
                fontWeight: note.read ? "normal" : "bold",
                color: note.read ? "#ffffff" : "#ffffff", // ยังไม่ได้อ่านเป็นสีขาว
                display: "flex", // จัดข้อความและไอคอนในแนวนอน
                alignItems: "center", // จัดให้อยู่ตรงกลางในแนวตั้ง
              }}
            >
              <span style={{ marginRight: "10px" }}>📌</span>
              <div>
                <p><strong>Messages:</strong> {note.message}</p>
                <p><strong>Room:</strong> {note.roomName}</p>
                <p><strong>Start Time:</strong> {formatDateTime(note.startTime)}</p>
                <p><strong>End Time:</strong> {formatDateTime(note.endTime)}</p>
              </div>
              <span
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการคลิกซ้อน
                  handleDeleteNotification(note.id);
                }}
                style={{
                  marginLeft: "auto", // ดันถังขยะไปฝั่งขวา
                  color: "red",
                  cursor: "pointer",
                }}
              >
                🗑️
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications" style={{ textAlign: "center", color: "#888" }}>
          <span style={{ fontSize: "24px", marginRight: "10px" }}>🔔</span>
          <span>แจ้งเตือน</span>
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
