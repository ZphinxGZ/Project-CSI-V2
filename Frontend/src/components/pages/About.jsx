import React from "react";
import './About.css'; 

export const About = () => {
  return (
    <div className="about-container centered-content">
      <div className="title-container">
        <h2>รายการห้อง</h2>
      </div>
      <ul className="about-list">
        <li>
          <img src="../public/Room2.jpg" alt="ห้องประชุม 2" className="room-image" width="220" height="170" />
          <div className="room-details">
            <h2 className="room-title">ห้องประชุม 1</h2>
            <p>ห้องประชุมพร้อมระบบ Video conference ที่มีผู้เข้าร่วมประชุมรูปตัว U </p>
            <button className="btn blue">จองห้อง</button>
            <button className="btn orange">รายละเอียด</button>
          </div>
        </li>
        <li>
          <img src="../public/Room1.jpg" alt="ห้องประชุม 1" className="room-image" width="220" height="170" />
          <div className="room-details">
            <h2 className="room-title">ห้องประชุม 2</h2>
            <p>ห้องประชุมขนาดใหญ่ พร้อมสิ่งอำนวยความสะดวกครบครัน</p>
            <button className="btn blue">จองห้อง</button>
            <button className="btn orange">รายละเอียด</button>
          </div>
        </li>
        <li>
          <img src="../public/Room3.jpg" alt="ห้องประชุมสาขาเทคโนโลยีสารสนเทศ" className="room-image" width="220" height="170" />
          <div className="room-details">
            <h2 className="room-title-red">ห้องประชุมสาขาเทคโนโลยีสารสนเทศ</h2>
            <p>ห้องประชุมขนาดใหญ่ (Hall) เหมาะสำหรับการสัมมนาเป็นหมู่คณะ และ จัดเลี้ยง</p>
            <button className="btn blue">จองห้อง</button>
            <button className="btn orange">รายละเอียด</button>
          </div>
        </li>
      </ul>
    </div>
  );
};