//Referenced from: https://www.youtube.com/watch?v=9zTm0a0eQZc

import React, { useEffect, useState } from "react";
import { Box, Container, styled } from "@mui/material";
import Slide from "./Slide";
import Banner from "./Banner";
import { useDispatch, useSelector } from "react-redux";
import { getServices } from "../redux/userHandle";
import ServicesMenu from "./couple/components/ServicesMenu";
import { NewtonsCradle } from "@uiball/loaders";
import { Link } from "react-router-dom";

const Home = () => {
  const adURL = "d";

  const dispatch = useDispatch();

  const { serviceData, responseServices, error } = useSelector(
    (state) => state.user
  );

  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setShowNetworkError(true);
      }, 40000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <div id="top">
      <Container
        sx={{
          display: "none",
          "@media (max-width: 600px)": {
            display: "flex",
          },
        }}
      >
        <ServicesMenu dropName="Categories" />
        <ServicesMenu dropName="Services" />
      </Container>
      <BannerBox>
        <Banner />
      </BannerBox>

      {showNetworkError ? (
        <StyledContainer>
          <h1>Sorry, network error.</h1>
        </StyledContainer>
      ) : error ? (
        <StyledContainer>
          <h1>Please Wait A Second</h1>
          <NewtonsCradle size={70} speed={1.4} color="black" />
        </StyledContainer>
      ) : (
        <>
          {responseServices ? (
            <>
              <StyledContainer>No services found right now</StyledContainer>
              <StyledContainer>
                Become a vendor to add services
                <Link to={"/Vendorregister"}>Join</Link>
              </StyledContainer>
            </>
          ) : (
            <>
              <Component>
                <LeftComponent>
                  {/* <Slide services={serviceData} title="Top Selection" /> */}
                </LeftComponent>

                <RightComponent>
                  <img src={adURL} alt="" style={{ width: 217 }} />
                </RightComponent>
              </Component>

              {/* <Slide services={serviceData} title="Deals of the Day" /> */}
              <Slide services={serviceData} title="Suggested Vendors" />
              <Slide services={serviceData} title="Discounts for You" />
              {/* <Slide services={serviceData} title="Recommended Items" /> */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const BannerBox = styled(Box)`
  padding: 20px 10px;
  background: #f2f2f2;
`;

const Component = styled(Box)`
  display: flex;
`;

const LeftComponent = styled(Box)(({ theme }) => ({
  width: "83%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const RightComponent = styled(Box)(({ theme }) => ({
  marginTop: 10,
  background: "#FFFFFF",
  width: "17%",
  marginLeft: 10,
  padding: 5,
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
