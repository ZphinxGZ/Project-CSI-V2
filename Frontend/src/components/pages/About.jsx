import React, { useState, useEffect } from "react";
import './About.css';

export const About = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    room_name: "",
    description: "",
    image: "",
    capacity: "", // Added capacity field
    location: ""  // Added location field
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
      const response = await fetch("http://localhost:3000/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRoom((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      const response = await fetch(`http://localhost:3000/api/rooms${editingRoomId ? `/${editingRoomId}` : ''}`, {
        method: editingRoomId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoom)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedRoom = await response.json();
      const updatedRooms = editingRoomId
        ? rooms.map(room => room._id === editingRoomId ? updatedRoom : room)
        : [...rooms, updatedRoom];

      setRooms(updatedRooms);
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
      image: room.image,
      capacity: room.capacity, // Added capacity field
      location: room.location  // Added location field
    });
    setEditingRoomId(room._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?")) {
      const updatedRooms = rooms.filter(room => room._id !== id);
      setRooms(updatedRooms);
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
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

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  return (
    <div className="about-container centered-content">
      <div className="title-container">
        <h2>&nbsp;รายการจองห้อง</h2>
      </div>

      <ul className="about-list">
        {rooms.map((room) => (
          <li key={room._id}>
            <img
              src={room.image}
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
                <div className="left-buttons">
                  <button className="btn blue" onClick={() => handleBookRoom(room)}>จองห้อง</button>
                  <button className="btn yellow" onClick={() => handleViewDetails(room)}>รายละเอียด</button>
                </div>
                <div className="right-buttons">
                  <button className="btn orange" onClick={() => handleEdit(room)}>📝 แก้ไข</button>
                  <button className="btn red" onClick={() => handleDelete(room._id)}>🗑️ ลบ</button>
                </div>
              </div>
            </div>
          </li>
        ))}
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
              <h4>{editingRoomId ? "📝 แก้ไขห้อง" : "➕ เพิ่มห้องใหม่"}</h4>
              <button className="btn red" onClick={() => { setShowForm(false); setEditingRoomId(null); }}>❌</button>
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
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newRoom.image && (
              <div className="image-preview">
                <img
                  src={newRoom.image}
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
              <h4>📅 จองห้อง: {selectedRoom.room_name}</h4>
              <button className="btn red" onClick={closeBookingModal}>❌</button>
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

            <div style={{ marginTop: '1rem' }}>
              <label>👤 ชื่อผู้จอง:</label>
              <input
                type="text"
                value={selectedRoom.bookedBy || ""}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, bookedBy: e.target.value })}
                placeholder="กรอกชื่อผู้จอง"
              />
            </div>

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
              onClick={() => {
                const { bookedBy, bookingDate, startTime, endTime } = selectedRoom;

                if (!bookedBy || !bookingDate || !startTime || !endTime) {
                  return alert("กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น");
                }

                if (isHoliday(bookingDate)) {
                  return alert("ไม่สามารถจองในวันหยุด เสาร์-อาทิตย์ หรือวันหยุดนักขัตฤกษ์ได้ครับ");
                }

                if (getMinutes(startTime) !== "00" || getMinutes(endTime) !== "00") {
                  return alert("เวลาจองต้องเป็นแบบเต็มชั่วโมง เช่น 08:00 - 09:00 เท่านั้น");
                }

                if (startTime >= endTime) {
                  return alert("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
                }

                if (startTime < "08:00" || endTime > "19:00") {
                  return alert("เวลาจองต้องอยู่ในช่วง 08:00 ถึง 19:00 เท่านั้น");
                }

                alert(
                  `✅ จองสำเร็จ!\nชื่อผู้จอง: ${bookedBy}\nวันที่: ${bookingDate}\nเวลา: ${startTime} ถึง ${endTime}\nหมายเหตุ: ${selectedRoom.bookingNote || "-"}`
                );

                closeBookingModal();
              }}
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
              <h4>📖 รายละเอียดห้องประชุม</h4>
              <button className="btn red" onClick={closeDetailModal}>❌</button>
            </div>
            <img width="100%"
              src={detailRoom.image}
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