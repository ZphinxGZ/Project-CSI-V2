import React, { useEffect, useState } from "react";
import "./Contact.css";

export const Contact = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateTime) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTime).toLocaleString("th-TH", options);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3456/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const notificationsData = await response.json();

        const enrichedNotifications = await Promise.all(
          notificationsData.map(async (notification) => {
            const bookingResponse = await fetch(
              `http://localhost:3456/api/bookings/user`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!bookingResponse.ok) {
              throw new Error("Failed to fetch booking details");
            }

            const bookings = await bookingResponse.json();
            const booking = bookings.find(
              (b) => b.booking_id === notification.booking_id
            );

            const roomResponse = await fetch(
              `http://localhost:3456/api/rooms/${notification.room_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!roomResponse.ok) {
              throw new Error("Failed to fetch room details");
            }

            const room = await roomResponse.json();

            return {
              ...notification,
              roomName: room.room_name,
              startTime: booking?.start_time,
              endTime: booking?.end_time,
            };
          })
        );

        setNotifications(enrichedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3456/api/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((note) => note.notification_id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contact-container">
      {notifications.length > 0 ? (
        <div className="notifications">
          {notifications.map((note) => (
            <div
              key={note.notification_id}
              className="notification"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: "10px" }}>📌</span>
              <div>
                <p><strong>Message:</strong> {note.message}</p>
                <p><strong>Room:</strong> {note.roomName}</p>
                <p><strong>Start Time:</strong> {formatDateTime(note.startTime)}</p>
                <p><strong>End Time:</strong> {formatDateTime(note.endTime)}</p>
              </div>
              <span
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(note.notification_id);
                }}
                style={{
                  marginLeft: "auto",
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
          <span>No notifications available</span>
        </div>
      )}
    </div>
  );
};
