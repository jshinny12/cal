import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Calendar from './components/Calendar';



function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
