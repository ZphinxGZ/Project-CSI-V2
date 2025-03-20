import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { FaBell } from "react-icons/fa";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu") && !event.target.closest("ul")) {
        setMenuOpen(false);
      }
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav>
      <Link to="/" className="title">
        Dashboard
      </Link>

      {/* Hamburger Menu Button */}
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/about" activeclassname="active">จองห้อง</NavLink>
        </li>
        <li className="dropdown">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="dropbtn"
    >
      ดูประวัติการจอง
    </button>
    <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
      <NavLink to="/services?filter=ทั้งหมด">ประวัติทั้งหมด</NavLink>
      <NavLink to="/services?filter=ไม่อนุมัติ">รายการไม่อนุมัติ</NavLink>
      <NavLink to="/services?filter=อนุมัติ">รายการอนุมัติ</NavLink>
      <NavLink to="/services?filter=รอตรวจสอบ">รายการรอตรวจสอบ</NavLink>
    </div>
</li>
        <li>
          <NavLink to="/contact">แจ้งเตือน <FaBell /></NavLink>
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