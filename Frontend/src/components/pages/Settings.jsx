import React from "react";
import "./Settings.css";

export const Settings = () => {
  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      <div className="settings-section">
        
        <button className="change-password-btn">Change Password</button>
        <button className="delete-account-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default Settings;
