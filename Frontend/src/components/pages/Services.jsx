import React from "react";
import './Services.css';

export const Services = () => {
  return (
    <>
      <h1 className="header">Services</h1>
      <div className="card">
        <section className="booking-history" style={{ width: '100%', color: 'black' }}>
          <h2>Booking History</h2>
          <div className="filter-section" style={{ fontSize: '1.2em' }}>
            <label>Show 
              <select>
                <option>30 items</option>
                <option>50 items</option>
                <option>100 items</option>
              </select>
            </label>
            <label>From <input type="date" /></label>
            <label>To <input type="date" /></label>
            <label>Room 
              <select>
                <option>All</option>
                <option>Room 1</option>
                <option>Room 2</option>
                <option>Room 3</option>
              </select>
            </label>
            <button>Go</button>
          </div>
          <table className="large-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Room Name</th>
                <th>Booker Name</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Meeting</td>
                <td>Room 1</td>
                <td>John Doe</td>
                <td>2023-10-01</td>
                <td>Confirmed</td>
                <td>Project discussion</td>
              </tr>
              <tr>
                <td>Workshop</td>
                <td>Room 2</td>
                <td>Jane Smith</td>
                <td>2023-10-02</td>
                <td>Pending</td>
                <td>Training session</td>
              </tr>
              <tr>
                <td>Conference</td>
                <td>Room 3</td>
                <td>Emily Johnson</td>
                <td>2023-10-03</td>
                <td>Cancelled</td>
                <td>Client meeting</td>
              </tr>
            </tbody>
          </table>
          <div className="actions">
            <button className="btn red">Delete</button>
            <button>Apply to selected</button>
          </div>
        </section>
      </div>
    </>
  );
};
