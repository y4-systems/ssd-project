import { Container, Grid, Paper } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
// import Guests from "../../assets/img1.png";
// import Tablees from "../../assets/img2.png";
// import Vendors from "../../assets/img3.png";
// import Fees from "../../assets/img4.png";
import styled from "styled-components";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllStablees } from "../../redux/stableRelated/stableHandle";
import { getAllGuests } from "../../redux/guestRelated/guestHandle";
import { getAllVendors } from "../../redux/vendorRelated/vendorHandle";
import { getAllCouples } from "../../redux/coupleRelated/coupleHandle";

const Guests = "https://cdn-icons-png.flaticon.com/128/6454/6454552.png";
const Vendors = "https://cdn-icons-png.flaticon.com/128/1924/1924815.png";
const Tablees = "https://cdn-icons-png.flaticon.com/128/3724/3724489.png";
const Fees = "https://cdn-icons-png.flaticon.com/128/1139/1139931.png";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { guestsList } = useSelector((state) => state.guest);
  const { stableesList } = useSelector((state) => state.stable);
  const { vendorsList } = useSelector((state) => state.vendor);

  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllGuests(adminID));
    dispatch(getAllStablees(adminID, "Stable"));
    dispatch(getAllVendors(adminID));
    dispatch(getAllCouples(adminID));
  }, [adminID, dispatch]);

  const numberOfGuests = guestsList && guestsList.length;
  const numberOfTablees = stableesList && stableesList.length;
  const numberOfVendors = vendorsList && vendorsList.length;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Guests} alt="Guests" width="30%" />
              <Title>Total Guests</Title>
              <Data start={0} end={numberOfGuests} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Tablees} alt="Tables" width="30%" />
              <Title>Total Tables</Title>
              <Data start={0} end={numberOfTablees} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Vendors} alt="Vendors" width="30%" />
              <Title>Total Vendors</Title>
              <Data start={0} end={numberOfVendors} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Fees} alt="Fees" width="30%" />
              <Title>Gift Collection</Title>
              <Data start={0} end={10000} duration={2.5} prefix="LKR " />{" "}
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
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

export default AdminHomePage;
