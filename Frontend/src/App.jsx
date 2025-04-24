import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { About, Contact, Home, Services } from "./components/pages/";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import Settings from "./components/pages/Settings";
import "bootstrap-icons/font/bootstrap-icons.css";

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
      {window.location.pathname !== "/login" && window.location.pathname !== "/register" && (
        <Navbar token={token} setToken={setToken} />
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={token ? <Settings token={token} /> : <Login onLoginSuccess={handleLogin} />} />
          <Route
            path="/login"
            element={
              <div>
                <Login onLoginSuccess={handleLogin} />
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
