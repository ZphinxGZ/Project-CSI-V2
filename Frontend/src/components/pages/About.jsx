import React, { useState, useEffect } from "react";
import './About.css';

export const About = () => {
  const defaultRooms = [
    {
      id: 1,
      image: "../public/Room2.jpg",
      name: "ห้องประชุม 1",
      description: "ห้องประชุมพร้อมระบบ Video conference ที่มีผู้เข้าร่วมประชุมรูปตัว U"
    },
    {
      id: 2,
      image: "../public/Room1.jpg",
      name: "ห้องประชุม 2",
      description: "ห้องประชุมขนาดใหญ่ พร้อมสิ่งอำนวยความสะดวกครบครัน"
    },
    {
      id: 3,
      image: "../public/Room3.jpg",
      name: "ห้องประชุมสาขาเทคโนโลยีสารสนเทศ",
      description: "ห้องประชุมขนาดใหญ่ (Hall) เหมาะสำหรับการสัมมนาเป็นหมู่คณะ และ จัดเลี้ยง"
    }
  ];

  const [rooms, setRooms] = useState(() => {
    const stored = localStorage.getItem("rooms");
    return stored ? JSON.parse(stored) : defaultRooms;
  });

  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    image: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);
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

  // 👉 ใส่ function นี้ด้านบนใน About component ก่อน return
  const publicHolidays = ["01-01", "04-13", "04-14", "04-15", "12-05", "12-10"]; // ตัวอย่างวันหยุด
  const getMinutes = (time) => time.split(":")[1];
  const isHoliday = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const formatted = date.toISOString().slice(5, 10); // MM-DD
    return day === 0 || day === 6 || publicHolidays.includes(formatted);
  };

  const handleAddOrUpdateRoom = () => {
    if (!newRoom.name || !newRoom.description || !newRoom.image) {
      return alert("กรุณากรอกข้อมูลให้ครบ");
    }

    let updatedRooms;

    if (editingRoomId !== null) {
      updatedRooms = rooms.map(room =>
        room.id === editingRoomId ? { ...room, ...newRoom } : room
      );
    } else {
      const newRoomData = {
        id: rooms.length ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
        ...newRoom
      };
      updatedRooms = [...rooms, newRoomData];
    }

    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setNewRoom({ name: "", description: "", image: "" });
    setShowForm(false);
    setEditingRoomId(null);
  };

  const handleEdit = (room) => {
    setNewRoom({
      name: room.name,
      description: room.description,
      image: room.image
    });
    setEditingRoomId(room.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?")) {
      const updatedRooms = rooms.filter(room => room.id !== id);
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
          <li key={room.id}>
            <img
              src={room.image}
              alt={room.name}
              className="room-image"
              width="220"
              height="170"
            />
            <div className="room-details">
              <h2 className="room-title">{room.name}</h2>
              <p>{room.description}</p>

              <div className="room-buttons">
                <div className="left-buttons">
                  <button className="btn blue" onClick={() => handleBookRoom(room)}>จองห้อง</button>
                  <button className="btn yellow" onClick={() => handleViewDetails(room)}>รายละเอียด</button>
                </div>
                <div className="right-buttons">
                  <button className="btn orange" onClick={() => handleEdit(room)}>📝 แก้ไข</button>
                  <button className="btn red" onClick={() => handleDelete(room.id)}>🗑️ ลบ</button>
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
              name="name"
              placeholder="ชื่อห้อง"
              value={newRoom.name}
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
              <h4>📅 จองห้อง: {selectedRoom.name}</h4>
              <button className="btn red" onClick={closeBookingModal}>❌</button>
            </div>

            <p><strong>รายละเอียดห้อง:</strong> {selectedRoom.description}</p>
            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
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
              alt={detailRoom.name}
              
            />
            <h3 >{detailRoom.name}</h3>
            <p>{detailRoom.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};