import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { AccountCircle, Person, Group } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(
    (state) => state.user
  );

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Adminlogin");
      }
    } else if (user === "Guest") {
      if (visitor === "guest") {
        const rollNum = "1";
        const guestName = "Dipesh Awasthi";
        const fields = { rollNum, guestName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Guestlogin");
      }
    } else if (user === "Vendor") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Vendorlogin");
      }
    } else if (user === "Couple") {
      if (visitor === "guest") {
        const email = "sad@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Couplelogin");
      }
    } else if (user === "FinanceManager") {
      if (visitor === "guest") {
        const email = "ash@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/FinanceManagerlogin");
      }
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Guest") {
        navigate("/Guest/dashboard");
      } else if (currentRole === "Vendor") {
        navigate("/Vendor/dashboard");
      } else if (currentRole === "Couple") {
        navigate("/Couple/dashboard");
      } else if (currentRole === "FinanceManager") {
        navigate("/FinanceManager/dashboard");
      }
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <StyledContainer1>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <div onClick={() => navigateHandler("Admin")}>
                <StyledPaper elevation={3}>
                  <Box mb={2}>
                    <AccountCircle fontSize="large" />
                  </Box>
                  <StyledTypography>Event Manager</StyledTypography>
                  Login as an Event Manager to manage events and more.
                </StyledPaper>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper elevation={3}>
                <div onClick={() => navigateHandler("Guest")}>
                  <Box mb={2}>
                    <Person fontSize="large" />
                  </Box>
                  <StyledTypography>Guest</StyledTypography>
                  Login as a Guest to explore all event related details.
                </div>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper elevation={3}>
                <div onClick={() => navigateHandler("Vendor")}>
                  <Box mb={2}>
                    <Group fontSize="large" />
                  </Box>
                  <StyledTypography>Vendor</StyledTypography>
                  Login as a Vendor to manage Services and track guests.
                </div>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper elevation={3}>
                <div onClick={() => navigateHandler("Couple")}>
                  <Box mb={2}>
                    <Group fontSize="large" />
                  </Box>
                  <StyledTypography>Couple</StyledTypography>
                  Login as a Couple to manage your memorable day.
                </div>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper elevation={3}>
                <div onClick={() => navigateHandler("FinanceManager")}>
                  <Box mb={2}>
                    <AttachMoneyIcon fontSize="large" />
                  </Box>
                  <StyledTypography>Finance Manager</StyledTypography>
                  Login as a Finance Manager to manage budget.
                </div>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loader}
        >
          <CircularProgress color="inherit" />
          Please Wait
        </Backdrop>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </StyledContainer1>
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  // background: linear-gradient(to bottom, #c6d9f7, #b4cffa);
  background: url("https://images.pexels.com/photos/752842/pexels-photo-752842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  height: 120vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const StyledContainer1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  margin-top: 5px;

  &:hover {
    background-color: #0d66ff;
    color: white;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
`;
