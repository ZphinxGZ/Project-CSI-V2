import React, { useState, useEffect } from "react";
import './About.css';
import { Modal, Button } from "react-bootstrap";

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
  const [userRole, setUserRole] = useState(null); // Add state for user role
  const [confirmDelete, setConfirmDelete] = useState(null); // State for delete confirmation
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const durationOptions = [
    { label: "1 ชั่วโมง", value: 1 },
    { label: "1 ชั่วโมงครึ่ง", value: 1.5 },
    { label: "2 ชั่วโมง", value: 2 },
    { label: "2 ชั่วโมงครึ่ง", value: 2.5 },
    { label: "3 ชั่วโมง", value: 3 },
  ];

  useEffect(() => {
    fetchRooms();
    fetchUserRole(); // Fetch user role on component mount
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

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3456/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role); // Set the user's role
      } else {
        console.error("Failed to fetch user role");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setNewRoom({
      ...newRoom,
      image: e.target.files[0] // Set the selected file
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
      const formData = new FormData();
      formData.append("room_name", newRoom.room_name);
      formData.append("capacity", newRoom.capacity);
      formData.append("location", newRoom.location);
      formData.append("description", newRoom.description);
      if (newRoom.image instanceof File) {
        formData.append("image", newRoom.image); // Append the file if it's a File object
      }

      const response = await fetch(`http://localhost:3456/api/rooms${editingRoomId ? `/${editingRoomId}` : ''}`, {
        method: editingRoomId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}` // Add token to headers
        },
        body: formData // Use FormData for file upload
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
      setConfirmDelete(null); // Close confirmation popup
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("เกิดข้อผิดพลาดในการลบห้อง");
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

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setSelectedRoom({ ...selectedRoom, startTime, endTime: "" }); // Reset endTime when startTime changes
  };

  const handleDurationChange = (e) => {
    const duration = parseFloat(e.target.value);
    const startTime = selectedRoom.startTime;
    if (startTime) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endTime = new Date(0, 0, 0, hours + Math.floor(duration), minutes + (duration % 1) * 60)
        .toTimeString()
        .slice(0, 5);
      setSelectedRoom({ ...selectedRoom, endTime });
    }
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

      setShowSuccessModal(true); // Show success modal instead of alert
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
                src={`http://localhost:3456${room.image_url}`} // Prepend base URL to image_url
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
                  {userRole === "admin" && ( // Conditionally render edit and delete buttons for admin
                    <div className="button-group">
                      <button className="btn orange" onClick={() => handleEdit(room)}>
                        📝 แก้ไข
                      </button>
                      <button
                        className="btn red"
                        onClick={() => setConfirmDelete(room.room_id)} // Open confirmation popup
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>ไม่มีห้องที่จะแสดง</p> // Display a message when no rooms are available
        )}
      </ul>

      {/* Confirmation Popup */}
      {confirmDelete && (
        <>
          <div className="confirmation-popup-overlay"></div>
          <div className="confirmation-popup">
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?</p>
            <div className="confirmation-buttons">
              <button
                className="btn confirm"
                onClick={() => handleDelete(confirmDelete)}
              >
                ยืนยัน
              </button>
              <button
                className="btn cancel"
                onClick={() => setConfirmDelete(null)} // Close confirmation popup
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </>
      )}

      {!showForm && userRole === "admin" && ( // Conditionally render "เพิ่มห้องใหม่" button for admin
        <div className="text-center my-4">
          <button className="btn green" onClick={() => setShowForm(true)}>
            ➕ เพิ่มห้องใหม่
          </button>
        </div>
      )}

      <Modal  show={showForm} onHide={() => { setShowForm(false); setEditingRoomId(null); }}>
        <Modal.Header >
          <Modal.Title>{editingRoomId ? "📝 แก้ไขห้อง" : "➕ เพิ่มห้องใหม่"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" name="room_name" placeholder="ชื่อห้อง" value={newRoom.room_name} onChange={handleChange} />
          <input type="text" name="description" placeholder="รายละเอียดห้อง" value={newRoom.description} onChange={handleChange} />
          <input type="text" name="capacity" placeholder="ความจุ" value={newRoom.capacity} onChange={handleChange} />
          <input type="text" name="location" placeholder="สถานที่" value={newRoom.location} onChange={handleChange} />
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
          {newRoom.image && newRoom.image instanceof File && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(newRoom.image)} // Preview the selected file
                alt="Preview" 
                style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem', borderRadius: '8px', display: 'block' , marginLeft: 'auto', marginRight: 'auto' }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowForm(false); setEditingRoomId(null); }}>ปิด</Button>
          <Button    variant="success" onClick={handleAddOrUpdateRoom}>{editingRoomId ? "✔ บันทึก" : "✔ เพิ่มห้อง"}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBookingModal} onHide={closeBookingModal}>
        <Modal.Header>
          <Modal.Title>📅 จองห้อง: {selectedRoom?.room_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>รายละเอียดห้อง:</strong> {selectedRoom?.description}</p>
          <p><strong>ความจุ:</strong> {selectedRoom?.capacity}</p>
          <p><strong>สถานที่:</strong> {selectedRoom?.location}</p>
          <img
            src={`http://localhost:3456${selectedRoom?.image_url}`}
            alt={selectedRoom?.room_name}
            style={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              margin: '1rem auto 0',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <label>📌 วันที่จอง:</label>
            <input
              type="date"
              value={selectedRoom?.bookingDate || ""}
              onChange={(e) => setSelectedRoom({ ...selectedRoom, bookingDate: e.target.value })}
            />
            {selectedRoom?.bookingDate && isHoliday(selectedRoom.bookingDate) && (
              <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.3rem' }}>
                🚫 ไม่สามารถจองในวันหยุด เสาร์-อาทิตย์ หรือวันนักขัตฤกษ์ได้
              </p>
            )}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label>🕐 เวลาเริ่มต้น:</label>
            <select
              value={selectedRoom?.startTime || ""}
              onChange={handleStartTimeChange}
              style={{ width: '100%', marginTop: '0.3rem' }}
            >
              <option value="" disabled>เลือกเวลาเริ่มต้น</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label>⏳ ระยะเวลา:</label>
            <select
              value={selectedRoom?.endTime ? durationOptions.find(d => d.value === (new Date(`1970-01-01T${selectedRoom.endTime}:00Z`) - new Date(`1970-01-01T${selectedRoom.startTime}:00Z`)) / 3600000)?.value : ""}
              onChange={handleDurationChange}
              style={{ width: '100%', marginTop: '0.3rem' }}
              disabled={!selectedRoom?.startTime}
            >
              <option value="" disabled>เลือกระยะเวลา</option>
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label>📝 รายละเอียดเพิ่มเติม:</label>
            <textarea
              rows="3"
              placeholder="ระบุวัตถุประสงค์หรือหมายเหตุ"
              value={selectedRoom?.bookingNote || ""}
              onChange={(e) => setSelectedRoom({ ...selectedRoom, bookingNote: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeBookingModal}>ยกเลิก</Button>
          <Button variant="success" onClick={confirmBooking}>✔ ยืนยัน</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDetailModal} onHide={closeDetailModal}>
        <Modal.Header >
          <Modal.Title>📖 รายละเอียดห้องประชุม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`http://localhost:3456${detailRoom?.image_url}`} alt={detailRoom?.room_name} width="100%" />
          <h3>{detailRoom?.room_name}</h3>
          <p>{detailRoom?.description}</p>
          <p><strong>ความจุ:</strong> {detailRoom?.capacity}</p>
          <p><strong>สถานที่:</strong> {detailRoom?.location}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetailModal}>ปิด</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header >
          <Modal.Title>✅ การจองสำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>การจองของคุณสำเร็จเรียบร้อยแล้ว!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>ปิด</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};