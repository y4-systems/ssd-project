import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import ViewService from "./pages/ViewService";
import Navbar from "./pages/Navbar";
import AuthenticationPage from "./pages/AuthenticationPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import CoupleSearch from "./pages/couple/pages/CoupleSearch";
import Services from "./components/Services";
import { useEffect } from "react";
import { getServices } from "./redux/userHandle";
import CoupleBookings from "./pages/couple/pages/CoupleBookings";
import CheckoutSteps from "./pages/couple/pages/CheckoutSteps";
import Profile from "./pages/couple/pages/Profile";
import Logout from "./pages/Logout";
import { isTokenValid } from "./redux/userSlice";
import CheckoutAftermath from "./pages/couple/pages/CheckoutAftermath";
import ViewBooking from "./pages/couple/pages/ViewBooking";

const App = () => {
  const dispatch = useDispatch();

  const { isLoggedIn, currentToken, currentRole, serviceData } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getServices());

    if (currentToken) {
      dispatch(isTokenValid());
    }
  }, [dispatch, currentToken]);

  return (
    <BrowserRouter>
      {!isLoggedIn && currentRole === null && (
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route
              path="/Services"
              element={<Services serviceData={serviceData} />}
            />

            <Route path="/service/view/:id" element={<ViewService />} />

            <Route path="/Search" element={<CoupleSearch mode="Mobile" />} />
            <Route
              path="/ServiceSearch"
              element={<CoupleSearch mode="Desktop" />}
            />

            <Route
              path="/Coupleregister"
              element={<AuthenticationPage mode="Register" role="Couple" />}
            />
            <Route
              path="/Couplelogin"
              element={<AuthenticationPage mode="Login" role="Couple" />}
            />
            <Route
              path="/Vendorregister"
              element={<AuthenticationPage mode="Register" role="Vendor" />}
            />
            <Route
              path="/Vendorlogin"
              element={<AuthenticationPage mode="Login" role="Vendor" />}
            />
          </Routes>
        </>
      )}

      {isLoggedIn && currentRole === "Couple" && (
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route
              path="/Services"
              element={<Services serviceData={serviceData} />}
            />

            <Route path="/service/view/:id" element={<ViewService />} />

            <Route path="/Search" element={<CoupleSearch mode="Mobile" />} />
            <Route
              path="/ServiceSearch"
              element={<CoupleSearch mode="Desktop" />}
            />

            <Route path="/Checkout" element={<CheckoutSteps />} />
            <Route path="/service/buy/:id" element={<CheckoutSteps />} />
            <Route path="/Aftermath" element={<CheckoutAftermath />} />

            <Route path="/Profile" element={<Profile />} />
            <Route path="/Bookings" element={<CoupleBookings />} />
            <Route path="/booking/view/:id" element={<ViewBooking />} />
            <Route path="/Logout" element={<Logout />} />
          </Routes>
        </>
      )}

      {isLoggedIn &&
        (currentRole === "Vendor" || currentRole === "Shopinvoice") && (
          <>
            <VendorDashboard />
          </>
        )}
    </BrowserRouter>
  );
};

export default App;
