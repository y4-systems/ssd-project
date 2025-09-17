import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GuestDashboard from "./pages/guest/GuestDashboard";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import CoupleDashboard from "./pages/couple/CoupleDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
    <Router>
      {currentRole === null && (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route
            path="/chooseasguest"
            element={<ChooseUser visitor="guest" />}
          />

          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Guestlogin" element={<LoginPage role="Guest" />} />
          <Route path="/Vendorlogin" element={<LoginPage role="Vendor" />} />
          <Route path="/Couplelogin" element={<LoginPage role="Couple" />} />
          <Route
            path="/FinanceManagerlogin"
            element={<LoginPage role="FinanceManager" />}
          />

          <Route path="/Adminregister" element={<AdminRegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard />
        </>
      )}

      {currentRole === "Guest" && (
        <>
          <GuestDashboard />
        </>
      )}

      {currentRole === "Vendor" && (
        <>
          <VendorDashboard />
        </>
      )}

      {currentRole === "Couple" && (
        <>
          <CoupleDashboard />
        </>
      )}
    </Router>
  );
};

export default App;
