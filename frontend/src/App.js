import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Register from './components/Register';
import Navbar from "./components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NoUser from "./components/NoUser";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Import Day.js adapter
import { Container } from "@mui/material";




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('user'));
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!sessionStorage.getItem('user'));
    };

    window.addEventListener('storage', handleStorageChange);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (

    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
       <Container maxWidth="md" sx={{ marginTop: 4 }}>
      {
        isLoggedIn ?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </LocalizationProvider>
          :
          <Routes>
            <Route path="/" element={<NoUser />} />
            <Route path="/calendar" element={<NoUser />} />
            <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          
      }
      </Container>
    </div>

  );
}

export default App;
