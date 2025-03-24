import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { About, Contact, Home, Services } from "./components/pages/";
import Login from "./components/pages/login";
import Register from "./components/pages/register";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

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
          <Route path="*" element={<Login onLoginSuccess={handleLogin} />} />
        </Routes>
      )}
      {token && (
        <div className="container">
          <Navbar token={token} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <button onClick={() => setToken(null)}>Logout</button> 
        </div>
      )}
    </div>
  );
}

export default App;
