import { Container, Grid, Paper } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import styled from "styled-components";
import Guests from "../../assets/guests.png";
import Lessons from "../../assets/red-carpet.png";
import Tests from "../../assets/party.png";
import Time from "../../assets/revenue.png";
import {
  getTableGuests,
  getPreferenceDetails,
} from "../../redux/stableRelated/stableHandle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const VendorHomePage = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { preferenceDetails, stableGuests } = useSelector(
    (state) => state.stable
  );

  const tableID = currentUser.teachStable?._id;
  const preferenceID = currentUser.teachPreference?._id;

  useEffect(() => {
    dispatch(getPreferenceDetails(preferenceID, "Preference"));
    dispatch(getTableGuests(tableID));
  }, [dispatch, preferenceID, tableID]);

  const numberOfGuests = stableGuests && stableGuests.length;
  const numberOfSessions = preferenceDetails && preferenceDetails.sessions;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Guests} alt="Guests" width="30%" />
              <Title>Table Guests</Title>
              <Data start={0} end={numberOfGuests} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Lessons} alt="Lessons" width="30%" />
              <Title>Future Events</Title>
              <Data start={0} end={numberOfSessions} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Tests} alt="Tests" width="30%" />
              <Title>Organized Events</Title>
              <Data start={0} end={24} duration={4} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Time} alt="Time" width="30%" />
              <Title>Total Revenue</Title>
              <Data start={0} end={30} duration={4} suffix=" LKR" />{" "}
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <SeeNotice />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

export default VendorHomePage;
