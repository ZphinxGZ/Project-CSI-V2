import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS

export const Navbar = ({ token, setToken }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ username: "", role: "" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout modal

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

  const handleLogout = () => {
    setToken(null); // Clear the token
    setUserData({ username: "", role: "" }); // Reset user data
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav>
      <Link to="/" className="title">
        HOME
      </Link>

      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/about">Booking</NavLink>
        </li>
        <li>
          <NavLink to="/services">History</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Notifications</NavLink>
        </li>
        <li className="profile-link dropdown">
          <button
            className="btn btn-link dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {userData.username || "Guest"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            {token ? (
              <>
                {userData.role && (
                  <li>
                    <span className="dropdown-item-text">Role: {userData.role}</span>
                  </li>
                )}
                {userData.role && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => (window.location.href = "/settings")}
                    >
                      Settings
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setIsLogoutModalOpen(true)} // Open logout modal
                  >
                    Logout
                  </button>
                </li>
              </> 
            ) : (
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="btn confirm" onClick={handleLogout}>
                Confirm
              </button>
              <button
                className="btn cancel"
                onClick={() => setIsLogoutModalOpen(false)} // Close modal
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};