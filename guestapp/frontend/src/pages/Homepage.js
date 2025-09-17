import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Box, Button } from "@mui/material";
import styled from "styled-components";
// import Guests from "../assets/guests.svg";
import { LightPurpleButton } from "../components/buttonStyles";

const Homepage = () => {
  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1508905309331-76b1d900af31?q=80&w=1988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <StyledContainer>
        <Grid container spacing={0} sx={{ mt: 0 }}>
          <Grid item xs={4}>
            {/* <img src={Guests} alt="guests" style={{ width: "100%" }} /> */}
          </Grid>
        </Grid>
        <div>
          <StyledBoxRegister style={{ float: "right", marginTop: "200" }}>
            {/* <StyledText> */}
            {/* Don't have an account?{" "} */}
            <Link to="/Adminregister" style={{ color: "#550080" }}>
              <LightPurpleButton variant="contained" fullWidth>
                Sign up
              </LightPurpleButton>
            </Link>
            {/* </StyledText> */}
          </StyledBoxRegister>

          <StyledBox style={{ float: "right", marginTop: "200" }}>
            <StyledLink to="/choose">
              <LightPurpleButton variant="contained" fullWidth>
                Login
              </LightPurpleButton>

              {/* <Grid container spacing={2} columns={16}>
                            <Grid item xs={8}>
                                <item>xs=8</item>
                            </Grid>
                            <Grid item xs={8}>
                                <item>xs=8</item>
                            </Grid>
                            </Grid> */}
            </StyledLink>

            <StyledLink to="/chooseasguest">
              {/* <Button variant="outlined" fullWidth
                                    sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                                >
                                    Login as Guest
                                </Button> */}
            </StyledLink>
          </StyledBox>
        </div>
        <Grid item xs={4}>
          <StyledPaper elevation={3}>
            {/* <StyledTitle>Blissify Guest Portal</StyledTitle> */}
            <StyledText>
              {/* <h1><center> Welcome to Blissify</center></h1> */}
              {/* Streamline wedding management, event organization, and add vendors
              and guests. Seamlessly track attendance of guests, assess
              performance, and provide feedbacks. Access history records and
              communicate effortlessly. */}
            </StyledText>
          </StyledPaper>
        </Grid>
      </StyledContainer>
    </div>
  );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
`;

// const StyledBox = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   justify-content: right;
//   gap: 16px;
//   padding: 24px;
// `;

const StyledBox = styled(Box)`
  position: absolute;
  top: 0;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: right;
  gap: 16px;
  padding: 24px;
`;
const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  /* font-family: "Manrope"; */
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  /* color: #550080; */
  //   margin-top: 30px;
  //   margin-bottom: 30px;
  //   letter-spacing: normal;
  //   line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  margin-top: 20px;
`;

const StyledBoxRegister = styled(Box)`
  position: absolute;
  top: 0;
  right: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: right;
  gap: 16px;
  padding: 24px;
  margin-top: 20px;
`;
