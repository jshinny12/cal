import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Register from './components/Register';
import Navbar from "./components/Navbar";




function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
