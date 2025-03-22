import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { About, Contact, Home, Services } from "./components/pages/";
import Login from "./components/pages/login";
import Register from "./components/pages/register"; // Import Register component

function App() {
  const [token, setToken] = useState(null); // Initialize token as null
  const navigate = useNavigate();

  const handleLogin = (userToken) => {
    setToken(userToken);
    navigate("/");
  };

  return (
    <div className="App">
      {!token && (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login onLoginSuccess={handleLogin} />} /> {/* Redirect to login if no token */}
        </Routes>
      )}
      {token && (
        <div className="container">
          <Navbar />
          <button onClick={() => setToken(null)}>Logout</button> {/* ปุ่ม Logout */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
