import "./App.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventbookingOccasion from "./pages/EventbookingOccasion";
import "bootstrap/dist/css/bootstrap.min.css";
import UserEventbookings from "./pages/UserEventbookings";
import AddOccasion from "./pages/AddOccasion";
import AdminHome from "./pages/AdminHome";
import EditOccasion from "./pages/EditOccasion";
import axios from "axios";
import AllEventbookings from "./pages/AllEventbookings";

function App() {
  axios.defaults.baseURL = "http://localhost:5003";
  //Get user details from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="App">
      <BrowserRouter>
        {/* Admin Routes */}
        {user && user.role == "Admin" ? (
          <Routes>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/addoccasion" element={<AddOccasion />} />
            <Route
              path="/editoccasion/:occasionid"
              element={<EditOccasion />}
            />
            <Route path="/alleventbookings" element={<AllEventbookings />} />
          </Routes>
        ) : // User Routes
        user && user.role == "User" ? (
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/bookoccasion/:occasionid"
              element={<EventbookingOccasion />}
            />
            <Route path="/usereventbookings" element={<UserEventbookings />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
