import React, { useState, useEffect } from "react";
import './About.css';

export const About = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    room_name: "",
    description: "",
    image: "",
    capacity: "",
    location: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await fetch("http://localhost:3456/api/rooms", {
        headers: {
          Authorization: `Bearer ${token}` // Add token to headers
        }
      });

      if (response.status === 404) {
        console.warn("No rooms found (404).");
        setRooms([]); // Set rooms to an empty array if no data is found
        return;
      }

      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]); // Set rooms to an empty array on error
    }
  };

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const publicHolidays = ["01-01", "04-13", "04-14", "04-15", "12-05", "12-10"];
  const getMinutes = (time) => time.split(":")[1];
  const isHoliday = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const formatted = date.toISOString().slice(5, 10);
    return day === 0 || day === 6 || publicHolidays.includes(formatted);
  };

  const handleAddOrUpdateRoom = async () => {
    if (!newRoom.room_name || !newRoom.description || !newRoom.image || !newRoom.capacity || !newRoom.location) {
      return alert("กรุณากรอกข้อมูลให้ครบ");
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const roomData = {
        room_id: editingRoomId || undefined, // Include room_id if editing
        room_name: newRoom.room_name,
        capacity: newRoom.capacity,
        location: newRoom.location,
        description: newRoom.description,
        image_url: newRoom.image // Use `image_url` for the image
      };

      const response = await fetch(`http://localhost:3456/api/rooms${editingRoomId ? `/${editingRoomId}` : ''}`, {
        method: editingRoomId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Add token to headers
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        console.error("Server error response:", errorData); // Log server error
        throw new Error('Network response was not ok');
      }

      await fetchRooms(); // Fetch updated room list
      setNewRoom({ room_name: "", description: "", image: "", capacity: "", location: "" });
      setShowForm(false);
      setEditingRoomId(null);
    } catch (error) {
      console.error("Error adding/updating room:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขห้อง");
    }
  };

  const handleEdit = (room) => {
    setNewRoom({
      room_name: room.room_name,
      description: room.description,
      image: room.image_url, // Ensure image_url is used for editing
      capacity: room.capacity,
      location: room.location
    });
    setEditingRoomId(room.room_id); // Use room.room_id for editingRoomId
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?")) {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(`http://localhost:3456/api/rooms/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}` // Include token in headers
          }
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          console.error("Server error response:", errorData); // Log server error
          throw new Error("Network response was not ok");
        }

        await fetchRooms(); // Refresh the room list after deletion
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("เกิดข้อผิดพลาดในการลบห้อง");
      }
    }
  };

  const handleViewDetails = (room) => {
    setDetailRoom(room);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailRoom(null);
  };

  const handleBookRoom = async (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  const confirmBooking = async () => {
    const { bookingDate, startTime, endTime } = selectedRoom;

    if (!bookingDate || !startTime || !endTime) {
      return alert("กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น");
    }

    try {
      const token = localStorage.getItem("token");
      const formattedStartTime = `${bookingDate} ${startTime}:00`;
      const formattedEndTime = `${bookingDate} ${endTime}:00`;

      const response = await fetch("http://localhost:3456/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room_id: selectedRoom.room_id,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error("Network response was not ok");
      }

      const bookingData = await response.json(); // Parse the booking response
      console.log("Booking API response:", bookingData); // Log the response for debugging

      const { bookingId } = bookingData; // Extract bookingId from the response
      if (!bookingId) {
        console.error("Booking ID is undefined. Response:", bookingData);
        throw new Error("Booking ID is missing from the API response");
      }

      // Validate parameters before sending notification
      if (!bookingId || !selectedRoom.room_id) {
        console.error("Missing required parameters for notification:", { bookingId, room_id: selectedRoom.room_id });
        throw new Error("Notification parameters are undefined");
      }

      // Send notification
      try {
        const notificationResponse = await fetch("http://localhost:3456/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            booking_id: bookingId, // Use bookingId here
            room_id: selectedRoom.room_id,
            message: "Your booking has been approved."
          })
        });

        if (!notificationResponse.ok) {
          const notificationError = await notificationResponse.json();
          console.error("Notification error response:", notificationError);
          throw new Error("Failed to send notification");
        }
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
      }

      alert("✅ จองสำเร็จ!");
      closeBookingModal();
    } catch (error) {
      console.error("Error booking room:", error);
      alert("เกิดข้อผิดพลาดในการจองห้อง");
    }
  };

  return (
    <div className="about-container centered-content">
      <div className="title-container">
        <h2>&nbsp;รายการจองห้อง</h2>
      </div>

      <ul className="about-list">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.room_id}>
              <img
                src={room.image_url} // Updated to use room.image_url 
                alt={room.room_name}
                className="room-image"
                width="220"
                height="170"
              />
              <div className="room-details">
                <h2 className="room-title">{room.room_name}</h2>
                <p>{room.description}</p>
                <p><strong>ความจุ:</strong> {room.capacity}</p> {/* Display capacity */}
                <p><strong>สถานที่:</strong> {room.location}</p> {/* Display location */}

                <div className="room-buttons">
                  <div className="button-group">
                    <button className="btn blue" onClick={() => handleBookRoom(room)}>
                      📅 จองห้อง
                    </button>
                    <button className="btn yellow" onClick={() => handleViewDetails(room)}>
                      📖 รายละเอียด
                    </button>
                  </div>
                  <div className="button-group">
                    <button className="btn orange" onClick={() => handleEdit(room)}>
                      📝 แก้ไข
                    </button>
                    <button className="btn red" onClick={() => handleDelete(room.room_id)}>
                      🗑️ ลบ
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>ไม่มีห้องที่จะแสดง</p> // Display a message when no rooms are available
        )}
      </ul>

      {!showForm && (
        <div className="text-center my-4">
          <button className="btn green" onClick={() => setShowForm(true)}>
            ➕ เพิ่มห้องใหม่
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="form-header">
              <h4 className="name-dd">{editingRoomId ? "📝 แก้ไขห้อง" : "➕ เพิ่มห้องใหม่"}</h4>
              <button className="btn red dd" onClick={() => { setShowForm(false); setEditingRoomId(null); }}>✖</button>
            </div>
            <input
              type="text"
              name="room_name"
              placeholder="ชื่อห้อง"
              value={newRoom.room_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="รายละเอียดห้อง"
              value={newRoom.description}
              onChange={handleChange}
            />
            <input
              type="text"
              name="capacity"
              placeholder="ความจุ"
              value={newRoom.capacity}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="สถานที่"
              value={newRoom.location}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image"
              placeholder="URL รูปภาพ"
              value={newRoom.image} // Ensure this uses newRoom.image
              onChange={handleChange}
            />
            {newRoom.image && (
              <div className="image-preview">
                <img
                  src={newRoom.image} // Ensure the preview uses newRoom.image
                  alt="Preview"
                  width="100%"
                  style={{ marginTop: '1rem', borderRadius: '8px' }}
                />
              </div>
            )}
            <button className="btn green" onClick={handleAddOrUpdateRoom}>
              {editingRoomId ? "✔ บันทึกการแก้ไข" : "✔ เพิ่มห้อง"}
            </button>
          </div>
        </div>
      )}

      {/* ✅ Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="form-header">
              <h4 className="name-dd">📅 จองห้อง: {selectedRoom.room_name}</h4>
              <button className="btn red dd" onClick={closeBookingModal}>✖</button>
            </div>

            <p><strong>รายละเอียดห้อง:</strong> {selectedRoom.description}</p>
            <p><strong>ความจุ:</strong> {selectedRoom.capacity}</p> {/* Display capacity */}
            <p><strong>สถานที่:</strong> {selectedRoom.location}</p> {/* Display location */}
            <img
              src={selectedRoom.image}
              alt={selectedRoom.room_name}
              width="100%"
              style={{ marginTop: '1rem', borderRadius: '8px' }}
            />

            <div style={{ marginTop: '0.5rem' }}>
              <label>📌 วันที่จอง:</label>
              <input
                type="date"
                value={selectedRoom.bookingDate || ""}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, bookingDate: e.target.value })}
              />
              {selectedRoom.bookingDate && isHoliday(selectedRoom.bookingDate) && (
                <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.3rem' }}>
                  🚫 ไม่สามารถจองในวันหยุด เสาร์-อาทิตย์ หรือวันนักขัตฤกษ์ได้
                </p>
              )}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label>🕐 เวลาจอง:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="time"
                  step="3600"
                  value={selectedRoom.startTime || ""}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, startTime: e.target.value })}
                />
                <span style={{ alignSelf: 'center' }}>ถึง</span>
                <input
                  type="time"
                  step="3600"
                  value={selectedRoom.endTime || ""}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, endTime: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label>📝 รายละเอียดเพิ่มเติม:</label>
              <textarea
                rows="3"
                placeholder="ระบุวัตถุประสงค์หรือหมายเหตุ"
                value={selectedRoom.bookingNote || ""}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, bookingNote: e.target.value })}
              />
            </div>

            <button
              className="btn green"
              style={{ marginTop: '1rem' }}
              onClick={confirmBooking}
            >
              ✔ ยืนยันการจอง
            </button>

          </div>
        </div>
      )}
      {/* ✅ Detail Modal */}
      {showDetailModal && detailRoom && (
        <div className="modal-overlay">
          <div className="modal-content" >
            <div className="form-header">
              <h4 className="name-dd">📖 รายละเอียดห้องประชุม</h4>
              <button className="btn red dd" onClick={closeDetailModal}>✖</button>
            </div>
            <img width="100%"
              src={detailRoom.image_url} // เปลี่ยนจาก detailRoom.image เป็น detailRoom.image_url
              alt={detailRoom.room_name}
            />
            <h3 >{detailRoom.room_name}</h3>
            <p>{detailRoom.description}</p>
            <p><strong>ความจุ:</strong> {detailRoom.capacity}</p> {/* Display capacity */}
            <p><strong>สถานที่:</strong> {detailRoom.location}</p> {/* Display location */}
          </div>
        </div>
      )}
    </div>
  );
};