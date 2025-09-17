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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VendorSideBar from "./VendorSideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Logout from "../Logout";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import GuestAttendance from "../admin/guestRelated/GuestAttendance";

import VendorTableDetails from "./VendorTableDetails";
import VendorComplain from "./VendorComplain";
import VendorHomePage from "./VendorHomePage";
import VendorProfile from "./VendorProfile";
import VendorViewGuest from "./VendorViewGuest";
import GuestExamObliges from "../admin/guestRelated/GuestExamObliges";

const VendorDashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} position="absolute">
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
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Vendor Dashboard
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
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <VendorSideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<VendorHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Vendor/dashboard" element={<VendorHomePage />} />
            <Route path="/Vendor/profile" element={<VendorProfile />} />

            <Route path="/Vendor/complain" element={<VendorComplain />} />

            <Route path="/Vendor/table" element={<VendorTableDetails />} />
            <Route
              path="/Vendor/table/guest/:id"
              element={<VendorViewGuest />}
            />

            <Route
              path="/Vendor/table/guest/attendance/:guestID/:preferenceID"
              element={<GuestAttendance situation="Preference" />}
            />
            <Route
              path="/Vendor/table/guest/obliges/:guestID/:preferenceID"
              element={<GuestExamObliges situation="Preference" />}
            />

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
