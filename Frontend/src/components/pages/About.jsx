import React, { useState } from "react";
import './About.css';

export const About = () => {
  const [rooms, setRooms] = useState([
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
  ]);

  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    image: ""
  });

  const [showForm, setShowForm] = useState(false); // ✅ ควบคุมการแสดงฟอร์ม

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.description || !newRoom.image) {
      return alert("กรุณากรอกข้อมูลให้ครบ");
    }

    const newRoomData = {
      id: rooms.length + 1,
      ...newRoom
    };

    setRooms([...rooms, newRoomData]);
    setNewRoom({ name: "", description: "", image: "" });
    setShowForm(false); // ✅ ซ่อนฟอร์มหลังจากเพิ่ม
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
              <button className="btn blue">จองห้อง</button>
              <button className="btn yellow">รายละเอียด</button>
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
        <h4>➕ เพิ่มห้องใหม่</h4>
        <button className="btn red" onClick={() => setShowForm(false)}>❌</button>
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
        type="text"
        name="image"
        placeholder="URL รูปภาพ"
        value={newRoom.image}
        onChange={handleChange}
      />
      <button className="btn green" onClick={handleAddRoom}>
        ✔ เพิ่มห้อง
      </button>
    </div>
  </div>
)}
    </div>
    
  );
};