import React, { useEffect, useState } from "react";
import "./Contact.css";

export const Contact = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [confirmDelete, setConfirmDelete] = useState(null); // State for delete confirmation
  const [confirmRead, setConfirmRead] = useState(null); // State for read confirmation

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

  const handleConfirmRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3456/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((note) =>
          note.notification_id === id ? { ...note, is_read: true } : note
        )
      );

      // Show popup message
      setPopupMessage("Notification marked as read!");
      setTimeout(() => setPopupMessage(""), 3000); // Hide popup after 3 seconds
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setConfirmRead(null); // Close confirmation popup
    }
  };

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
      setPopupMessage("Notification deleted successfully!");
      setTimeout(() => setPopupMessage(""), 3000); // Hide popup after 3 seconds
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setConfirmDelete(null); // Close confirmation popup
    }
  };

  const handleNotificationClick = (id, isRead) => {
    if (isRead) {
      // Show popup message if already read
      setPopupMessage("This notification has already been marked as read.");
      setTimeout(() => setPopupMessage(""), 3000); // Hide popup after 3 seconds
    } else {
      setConfirmRead(id); // Open confirmation popup
    }
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="contact-container">
      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}
      {confirmRead && (
        <div className="confirmation-popup">
          <p>Are you sure you want to mark this notification as read?</p>
          <div className="confirmation-buttons">
            <button
              className="btn confirm"
              onClick={() => handleConfirmRead(confirmRead)}
            >
              Confirm
            </button>
            <button
              className="btn cancel"
              onClick={() => setConfirmRead(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="confirmation-popup">
          <p>Are you sure you want to delete this notification?</p>
          <div className="confirmation-buttons">
            <button
              className="btn confirm"
              onClick={() => handleDeleteNotification(confirmDelete)}
            >
              Confirm
            </button>
            <button
              className="btn cancel"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {notifications.length > 0 ? (
        <div className="notifications">
          {notifications.map((note) => (
            <div
              key={note.notification_id}
              className={`notification ${note.is_read ? "read" : "unread"}`}
              onClick={() => handleNotificationClick(note.notification_id, note.is_read)} // Check if already read
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
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
                  e.stopPropagation();
                  setConfirmDelete(note.notification_id); // Open confirmation popup
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
