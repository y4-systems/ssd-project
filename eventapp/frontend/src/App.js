// src/App.js
import "./App.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventbookingOccasion from "./pages/EventbookingOccasion";
import UserEventbookings from "./pages/UserEventbookings";
import AddOccasion from "./pages/AddOccasion";
import AdminHome from "./pages/AdminHome";
import EditOccasion from "./pages/EditOccasion";
import AllEventbookings from "./pages/AllEventbookings";
import SsoHandler from "./pages/SsoHandler";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  axios.defaults.baseURL = "http://localhost:5003";
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="App">
      <BrowserRouter>
        {user && user.role === "Admin" ? (
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/addoccasion" element={<AddOccasion />} />
            <Route path="/editoccasion/:occasionid" element={<EditOccasion />} />
            <Route path="/alleventbookings" element={<AllEventbookings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        ) : user ? (
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bookoccasion/:occasionid" element={<EventbookingOccasion />} />
            <Route path="/usereventbookings" element={<UserEventbookings />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/sso" element={<SsoHandler />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
