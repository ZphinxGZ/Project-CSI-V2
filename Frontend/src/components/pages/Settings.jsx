import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./Settings.css";

export const Settings = ({ token }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:3456/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.role === "admin"); // Set isAdmin based on the role
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3456/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleChangePassword = async () => {
    try {
      const response = await fetch("http://localhost:3456/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        setIsModalOpen(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        alert("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3456/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Account deleted successfully!");
        setIsDeleteModalOpen(false);
        localStorage.removeItem("token"); // Clear token from local storage
        navigate("/"); // Redirect to home page
        window.location.reload(); // Refresh the page
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRoleChange = (userId, role) => {
    setEditingUserId(userId);
    setNewRole(role);
  };

  const confirmRoleChange = async () => {
    try {
      const response = await fetch(`http://localhost:3456/api/users/${editingUserId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert("Role updated successfully!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === editingUserId ? { ...user, role: newRole } : user
          )
        );
        setEditingUserId(null);
        setNewRole("");
      } else {
        alert("Failed to update role. Please try again.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const cancelRoleChange = () => {
    setEditingUserId(null);
    setNewRole("");
  };

  return (
    <div className="settings-container" style={{ color: "black" }}>
      <h1>จัดการบัญชีของคุณ</h1>
      <div className="settings-section">
        <button
          className="change-password-btn btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          เปลี่ยนรหัสผ่าน
        </button>
        <button
          className="delete-account-btn btn btn-danger"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          ลบบัญชีผู้ใช้
        </button>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ color: "black" }}>
              <div className="modal-header">
                <h5 className="modal-title">เปลี่ยนรหัสผ่าน</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>รหัสผ่านเก่า:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>รหัสผ่านใหม่:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                >
                  ตกลง
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ color: "black" }}>
              <div className="modal-header">
                <h5 className="modal-title">คุณจะทำการลบบัญชีของคุณใช่ไหม</h5>
              </div>
              <div className="modal-body">
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของคุณ การลบบัญชีของคุณไม่สามารถกู้คืนได้</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  ตกลง
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdmin && token && (
        <div className="user-table-section">
          <h2>จัดการรายชื่อผู้ใช้ </h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ชื่อผู้ใช้</th>
                <th>สถานะเดิมผู้ใช้</th>
                <th style={{ width: "200px" }}>เปลี่ยน สถานะ</th>
                <th style={{ width: "150px" }}>แก้ไข</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    {editingUserId === user.user_id ? (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUserId === user.user_id ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={confirmRoleChange}
                        >
                          ตกลง
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={cancelRoleChange}
                        >
                          ยกเลิก
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRoleChange(user.user_id, user.role)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Settings;
