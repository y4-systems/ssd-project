import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useLocation } from "react-router-dom";

import WidgetsIcon from "@mui/icons-material/Widgets";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssistWalkerIcon from "@mui/icons-material/AssistWalker";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSelector } from "react-redux";

const SideBar = () => {
  const location = useLocation();

  const { currentRole } = useSelector((state) => state.user);

  return (
    <>
      <React.Fragment>
        <ListItemButton
          component={Link}
          to="/"
          sx={
            location.pathname === "/" ||
            location.pathname === "/Vendor/dashboard"
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <WidgetsIcon
              sx={{
                color:
                  location.pathname === "/" ||
                  location.pathname === "/Vendor/dashboard"
                    ? "#4d1c9c"
                    : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/Vendor/services"
          sx={
            location.pathname.startsWith("/Vendor/services")
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <AssistWalkerIcon
              sx={{
                color: location.pathname.startsWith("/Vendor/services")
                  ? "#4d1c9c"
                  : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/Vendor/bookings"
          sx={
            location.pathname.startsWith("/Vendor/bookings")
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <PendingActionsIcon
              sx={{
                color: location.pathname.startsWith("/Vendor/bookings")
                  ? "#4d1c9c"
                  : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/Vendor/viewcalendar"
          sx={
            location.pathname.startsWith("/Vendor/viewcalendar")
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <CalendarMonthIcon
              sx={{
                color: location.pathname.startsWith("/Vendor/viewcalendar")
                  ? "#4d1c9c"
                  : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItemButton>

        {currentRole === "Shopinvoice" && (
          <ListItemButton
            component={Link}
            to="/Vendor/shopinvoice"
            sx={
              location.pathname.startsWith("/Vendor/shopinvoice")
                ? styles.currentStyle
                : styles.normalStyle
            }
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon
                sx={{
                  color: location.pathname.startsWith("/Vendor/shopinvoice")
                    ? "#4d1c9c"
                    : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Shopinvoice" />
          </ListItemButton>
        )}
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListItemButton
          component={Link}
          to="/Vendor/profile"
          sx={
            location.pathname.startsWith("/Vendor/profile")
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <AccountCircleIcon
              sx={{
                color: location.pathname.startsWith("/Vendor/profile")
                  ? "#4d1c9c"
                  : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/logout"
          sx={
            location.pathname.startsWith("/logout")
              ? styles.currentStyle
              : styles.normalStyle
          }
        >
          <ListItemIcon>
            <LogoutIcon
              sx={{
                color: location.pathname.startsWith("/logout")
                  ? "#4d1c9c"
                  : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    </>
  );
};

export default SideBar;

const styles = {
  normalStyle: {
    color: "inherit",
    backgroundColor: "inherit",
  },
  currentStyle: {
    color: "#4d1c9c",
    backgroundColor: "#ebebeb",
  },
};
