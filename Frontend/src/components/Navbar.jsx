import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { FaBell } from "react-icons/fa";

export const Navbar = ({ token }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ username: "", role: "" });

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3456/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUserData({ username: data.username, role: data.role }))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [token]);

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
        หน้าหลัก 
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
          <NavLink to="/profile">{userData.username} ({userData.role})</NavLink>
        </li>
        <li>
          {/* <NavLink to="/login">Login</NavLink> */}
        </li>
      </ul>
    </nav>
  );
};