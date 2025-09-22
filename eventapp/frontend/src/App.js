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

  // same behavior as before: read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // eliminate nested ternary by precomputing routes
  let routes;

  if (user && user.role === "Admin") {
    // Admin routes
    routes = (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/addoccasion" element={<AddOccasion />} />
        <Route path="/editoccasion/:occasionid" element={<EditOccasion />} />
        <Route path="/alleventbookings" element={<AllEventbookings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  } else if (user) {
    // Logged-in non-admin routes
    routes = (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/bookoccasion/:occasionid"
          element={<EventbookingOccasion />}
        />
        <Route path="/usereventbookings" element={<UserEventbookings />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  } else {
    // Public / guest routes
    routes = (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/sso" element={<SsoHandler />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>{routes}</BrowserRouter>
    </div>
  );
}

export default App;
