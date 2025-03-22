import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { FaBell } from "react-icons/fa";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu") && !event.target.closest("ul")) {
        setMenuOpen(false);
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
        <li>
          <NavLink to="/services">ดูประวัติการจอง</NavLink>
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