import { useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppBar, Drawer, NavLogo } from "../../utils/styles";
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Logout from "../Logout";
import SideBar from "./components/SideBar";
import VendorHomePage from "./pages/VendorHomePage";

import AccountMenu from "./components/AccountMenu";
import ShowServices from "./pages/ShowServices";
import ShowBookings from "./pages/ShowBookings";
import ViewCalendar from "./pages/ViewCalendar";
import ViewServiceVendor from "./pages/ViewServiceVendor";
import AddService from "./pages/AddService";
import { useSelector } from "react-redux";
import Services from "../../components/Services";
import { serviceDataList } from "../../utils/services";
import ShopinvoiceSpecial from "./pages/ShopinvoiceSpecial";
import ShowCouples from "./pages/ShowCouples";
import VendorProfile from "./pages/VendorProfile";

const VendorDashboard = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { currentRole } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const homeHandler = () => {
    navigate("/");
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          open={open}
          position="absolute"
          sx={{ backgroundColor: "#4d1c9c" }}
        >
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <ListIcon />
            </IconButton>

            {/* Desktop */}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                mr: 2,
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <NavLogo
                to="top"
                activeClass="active"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={homeHandler}
              >
                {/* <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                Blissify
              </NavLogo>
            </Typography>

            {/* Mobile */}

            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <NavLogo
                to="top"
                activeClass="active"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={homeHandler}
              >
                {/* <AutoAwesomeIcon
                  sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                /> */}
                Blissify
              </NavLogo>
            </Typography>

            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <SideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<VendorHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Vendor/dashboard" element={<VendorHomePage />} />
            <Route path="/Vendor/profile" element={<VendorProfile />} />

            {/* Class */}
            <Route path="/Vendor/addservice" element={<AddService />} />
            <Route path="/Vendor/services" element={<ShowServices />} />
            <Route
              path="/Vendor/services/service/:id"
              element={<ViewServiceVendor />}
            />

            {currentRole === "Shopinvoice" && (
              <>
                <Route
                  path="/Vendor/shopinvoice"
                  element={<ShopinvoiceSpecial />}
                />
                <Route
                  path="/Vendor/uploadservices"
                  element={<Services serviceData={serviceDataList} />}
                />
              </>
            )}

            <Route path="/Vendor/bookings" element={<ShowBookings />} />
            <Route
              path="/Vendor/bookings/couples/:id"
              element={<ShowCouples />}
            />
            <Route
              path="/Vendor/bookings/service/:id"
              element={<ViewServiceVendor />}
            />

            <Route path="/Vendor/viewcalendar" element={<ViewCalendar />} />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default VendorDashboard;

const styles = {
  boxStyled: {
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
  },
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};
