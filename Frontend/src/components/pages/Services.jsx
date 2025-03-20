import React, { useState, useEffect } from "react";
import './Services.css';
import { useLocation } from "react-router-dom";

export const Services = () => {
  const [filter, setFilter] = useState("ทั้งหมด");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setDropdownOpen(false);
  };

  return (
    <>
      <h2 className="header">รายการจองของฉัน</h2>
      <div className="card">
        <section className="booking-history" style={{ width: '100%', color: 'black' }}>
          <div className="filter-section" style={{ fontSize: '1.2em' }}>
            <label>แสดง 
              <select className="show-select">
                <option>30 รายการ</option>
                <option>50 รายการ</option>
                <option>100 รายการ</option>
              </select>
            </label>
            <label>จาก <input type="date" /></label>
            <label>ถึง <input type="date" /></label>
            <label>ห้อง 
              <select>
                <option>ทั้งหมด</option>
                <option>Room 1</option>
                <option>Room 2</option>
                <option>Room 3</option>
              </select>
            </label>
            <label>สถานะ 
              <select>
                <option>ทั้งหมด</option>
                <option>ไม่อนุมัติ</option>
                <option>อนุมัติ</option>
                <option>รอตรวจสอบ</option>
              </select>
            </label>
            <button>Go</button>
          </div>
          <table className="large-table">
            <thead>
              <tr>
                <th>ชื่อห้อง</th>
                <th>สถานะ</th>
                <th>เหตุผล</th>
              </tr>
            </thead>
            <tbody>
              {/* Example data, filter logic should be implemented based on the selected filter */}
              {filter === "ทั้งหมด" && (
                <>
                  <tr>
                    <td>ห้องประชุม 1</td>
                    <td><button className="btn green">อนุมัติ</button></td>
                    <td>Project discussion</td>
                    <td><button className="btn blue">รายละเอียด</button></td>
                  </tr>
                  <tr>
                    <td>ห้องประชุม 2</td>
                    <td><button className="btn red">ไม่อนุมัติ</button></td>
                    <td>Training session</td>
                    <td><button className="btn blue">รายละเอียด</button></td>
                  </tr>
                  <tr>
                    <td>ห้องประชุม 3</td>
                    <td><button className="btn orange">รอตรวจสอบ</button></td>
                    <td>Client meeting</td>
                    <td><button className="btn blue">รายละเอียด</button></td>
                  </tr>
                </>
              )}
              {filter === "ไม่อนุมัติ" && (
                <tr>
                  <td>ห้องประชุม 2</td>
                  <td><button className="btn">ไม่อนุมัติ</button></td>
                  <td>Training session</td>
                  <td><button className="btn dark">รายละเอียด</button></td>
                </tr>
              )}
              {filter === "อนุมัติ" && (
                <tr>
                  <td>ห้องประชุม 1</td>
                  <td><button className="btn green">อนุมัติ</button></td>
                  <td>Project discussion</td>
                  <td><button className="btn blue">รายละเอียด</button></td>
                </tr>
              )}
              {filter === "รอตรวจสอบ" && (
                <tr>
                  <td>ห้องประชุม 3</td>
                  <td><button className="btn orange">รอตรวจสอบ</button></td>
                  <td>Client meeting</td>
                  <td><button className="btn blue">รายละเอียด</button></td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};
