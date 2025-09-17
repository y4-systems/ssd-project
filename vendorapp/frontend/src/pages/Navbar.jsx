import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Login, Logout, Shop2, Store } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { Avatar, Badge, Divider, Drawer, ListItemIcon } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { NavLogo } from "../utils/styles";

import Invoice from "./couple/components/Invoice";
import Search from "./couple/components/Search";
import ServicesMenu from "./couple/components/ServicesMenu";
import { updateCouple } from "../redux/userHandle";

const Navbar = () => {
  const { currentUser, currentRole } = useSelector((state) => state.user);

  const totalQuantity =
    currentUser &&
    currentUser.invoiceDetails &&
    currentUser.invoiceDetails.reduce(
      (total, item) => total + item.quantity,
      0
    );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (currentRole === "Couple") {
      console.log(currentUser);
      dispatch(updateCouple(currentUser, currentUser._id));
    }
  }, [currentRole, currentUser, dispatch]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSign, setAnchorElSign] = React.useState(null);

  const open = Boolean(anchorElUser);
  const openSign = Boolean(anchorElSign);

  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);

  // Invoice
  const handleOpenInvoice = () => {
    setIsInvoiceOpen(true);
  };

  const handleCloseInvoice = () => {
    setIsInvoiceOpen(false);
  };

  // Navigation Menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // User Menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Signin Menu
  const handleOpenSigninMenu = (event) => {
    setAnchorElSign(event.currentTarget);
  };

  const handleCloseSigninMenu = () => {
    setAnchorElSign(null);
  };

  const homeHandler = () => {
    navigate("/");
  };

  const navlogoRoleColors = () => {
    if (currentRole === "Couple") {
      return "#000";
    } else if (currentRole === "Vendor") {
      return "#ffff";
    } else {
      return "#000";
    }
  };
  const navbgRoleColors = () => {
    if (currentRole === "Couple") {
      return "#ffff";
    } else if (currentRole === "Vendor") {
      return "#4d1c9c";
    } else {
      return "#ffff";
    }
  };
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl" sx={{ backgroundColor: navbgRoleColors() }}>
        <Toolbar disableGutters>
          {/* MOBILE */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => {
                navigate("/Search");
              }}
              color="inherit"
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <HomeContainer>
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
                style={{ color: navlogoRoleColors() }}
              >
                Blissify
              </NavLogo>
            </Typography>
          </HomeContainer>

          {currentRole === null && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <Login />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  onClick={handleCloseUserMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/Couplelogin");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      Sign in as Couple
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/Vendorlogin");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      Sign in as Vendor
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            </Box>
          )}

          {/* DESKTOP */}

          <HomeContainer>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
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
                style={{ color: navlogoRoleColors() }}
              >
                {/* <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                Blissify
              </NavLogo>
            </Typography>
          </HomeContainer>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Search />
            <ServicesMenu dropName="Categories" />
            <ServicesMenu dropName="Services" />
          </Box>

          {currentRole === null && (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={handleOpenSigninMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                style={{ backgroundColor: "#4d1c9c" }}
              >
                Sign in
              </Button>
              <Menu
                anchorEl={anchorElSign}
                id="menu-appbar"
                open={openSign}
                onClose={handleCloseSigninMenu}
                onClick={handleCloseSigninMenu}
                PaperProps={{
                  elevation: 0,
                  sx: styles.styledPaper,
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigate("/Couplelogin")}>
                  <Avatar />
                  <Link to="/Couplelogin">Sign in as couple</Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate("/Vendorlogin")}>
                  <ListItemIcon>
                    <Store fontSize="small" />
                  </ListItemIcon>
                  <Link to="/Vendorlogin">Sign in as Vendor</Link>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* BOTH */}

          {currentRole === "Couple" && (
            <Box sx={{ flexGrow: 0, display: "flex" }}>
              <Tooltip title="Invoice">
                <IconButton
                  onClick={handleOpenInvoice}
                  sx={{ width: "4rem", color: "inherit", p: 0 }}
                >
                  <Badge badgeContent={totalQuantity} color="error">
                    <ReceiptLongIcon
                      sx={{ fontSize: "2rem", color: "#919191" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, backgroundColor: "#4d1c9c" }}
                  >
                    {String(currentUser.name).charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                id="menu-appbar"
                open={open}
                onClose={handleCloseUserMenu}
                onClick={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: styles.styledPaper,
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigate("/Profile")}>
                  <Avatar />
                  <Link to="/Profile">Profile</Link>
                </MenuItem>
                <MenuItem onClick={() => navigate("/Bookings")}>
                  <ListItemIcon>
                    <Shop2 fontSize="small" />
                  </ListItemIcon>
                  <Link to="/Bookings">My Bookings</Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate("/Logout")}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Link to="/Logout">Logout</Link>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>

      {isInvoiceOpen && (
        <Drawer
          anchor="right"
          open={isInvoiceOpen}
          onClose={handleCloseInvoice}
          sx={{
            width: "400px",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: "400px",
              boxSizing: "bbooking-box",
            },
          }}
        >
          <Invoice setIsInvoiceOpen={setIsInvoiceOpen} />
        </Drawer>
      )}
    </AppBar>
  );
};
export default Navbar;

const HomeContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const styles = {
  styledPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};
