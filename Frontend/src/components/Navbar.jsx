import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav>
      <Link to="/" className="title">
        Dashboard
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/about">จองห้อง</NavLink>
        </li>
        <li className="dropdown">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropbtn">ดูประวัติการจอง</button>
          <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
            <NavLink to="/services?filter=ทั้งหมด">ประวัติทั้งหมด</NavLink>
            <NavLink to="/services?filter=ไม่อนุมัติ">รายการไม่อนุมัติ</NavLink>
            <NavLink to="/services?filter=อนุมัติ">รายการอนุมัติ</NavLink>
            <NavLink to="/services?filter=รอตรวจสอบ">รายการรอตรวจสอบ</NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/contact">แจ้งเตือน</NavLink>
        </li>
        <li className="profile-link">
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};