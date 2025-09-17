import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToInvoice } from "../redux/userSlice";
import styled from "styled-components";
import { BasicButton } from "../utils/buttonStyles";
import { getServiceDetails, updateStuff } from "../redux/userHandle";
import {
  Avatar,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
import { generateRandomColor, timeAgo } from "../utils/helperFunctions";
import { MoreVert } from "@mui/icons-material";

const ViewService = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const serviceID = params.id;

  const { currentUser, currentRole, serviceDetails, loading, responseDetails } =
    useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getServiceDetails(serviceID));
  }, [serviceID, dispatch]);

  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const deleteHandler = (reviewId) => {
    const fields = { reviewId };

    dispatch(updateStuff(fields, serviceID, "deleteServiceReview"));
  };

  const reviewer = currentUser && currentUser._id;

  return (
    <>
      {loading ? (
        <Dialog open={true}>
          <DialogTitle>Loading...</DialogTitle>
        </Dialog>
      ) : (
        <>
          {responseDetails ? (
            <div>
              <Dialog open={true}>
                <DialogTitle>Service not found</DialogTitle>
              </Dialog>
            </div>
          ) : (
            <>
              <ServiceContainer>
                <div>
                  <ServiceImage
                    src={serviceDetails && serviceDetails.serviceImage}
                    alt={serviceDetails && serviceDetails.serviceName}
                  />
                </div>
                <div style={{ marginLeft: "50px", marginRight: "20px" }}>
                  <ServiceInfo>
                    <ServiceName>
                      {serviceDetails && serviceDetails.serviceName}
                    </ServiceName>
                    <PriceContainer>
                      <PriceCost>
                        LKR{" "}
                        {serviceDetails &&
                          serviceDetails.price &&
                          serviceDetails.price.cost}
                      </PriceCost>
                      <PriceMrp>
                        LKR{" "}
                        {serviceDetails &&
                          serviceDetails.price &&
                          serviceDetails.price.mrp}
                      </PriceMrp>
                      <PriceDiscount>
                        {serviceDetails &&
                          serviceDetails.price &&
                          serviceDetails.price.discountPercent}
                        % off
                      </PriceDiscount>
                    </PriceContainer>
                    <Description style={{ textAlign: "justify" }}>
                      {serviceDetails && serviceDetails.description}
                    </Description>
                    <ServiceDetails>
                      <p>
                        Category: {serviceDetails && serviceDetails.category}
                      </p>
                      <p>
                        Subcategory:{" "}
                        {serviceDetails && serviceDetails.subcategory}
                      </p>
                    </ServiceDetails>
                  </ServiceInfo>
                </div>
              </ServiceContainer>

              {currentRole === "Couple" && (
                <>
                  <ButtonContainer>
                    <BasicButton
                      onClick={() => dispatch(addToInvoice(serviceDetails))}
                    >
                      Add to Invoice
                    </BasicButton>
                  </ButtonContainer>
                </>
              )}
              <ReviewWritingContainer>
                <Typography variant="h4">Reviews</Typography>
              </ReviewWritingContainer>

              {serviceDetails.reviews && serviceDetails.reviews.length > 0 ? (
                <ReviewContainer>
                  {serviceDetails.reviews.map((review, index) => (
                    <ReviewCard key={index}>
                      <ReviewCardDivision>
                        <Avatar
                          sx={{
                            width: "60px",
                            height: "60px",
                            marginRight: "1rem",
                            backgroundColor: generateRandomColor(review._id),
                          }}
                        >
                          {String(review.reviewer.name).charAt(0)}
                        </Avatar>
                        <ReviewDetails>
                          <Typography variant="h6">
                            {review.reviewer.name}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "1rem",
                            }}
                          >
                            <Typography variant="body2">
                              {timeAgo(review.date)}
                            </Typography>
                          </div>
                          <Typography variant="subtitle1">
                            Rating: {review.rating}
                          </Typography>
                          <Typography variant="body1">
                            {review.comment}
                          </Typography>
                        </ReviewDetails>
                        {review.reviewer._id === reviewer && (
                          <>
                            <IconButton
                              onClick={handleOpenMenu}
                              sx={{ width: "4rem", color: "inherit", p: 0 }}
                            >
                              <MoreVert sx={{ fontSize: "2rem" }} />
                            </IconButton>
                            <Menu
                              id="menu-appbar"
                              anchorEl={anchorElMenu}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              keepMounted
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              open={Boolean(anchorElMenu)}
                              onClose={handleCloseMenu}
                              onClick={handleCloseMenu}
                            >
                              <MenuItem
                                onClick={() => {
                                  handleCloseMenu();
                                }}
                              >
                                <Typography textAlign="center">Edit</Typography>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  deleteHandler(review._id);
                                  handleCloseMenu();
                                }}
                              >
                                <Typography textAlign="center">
                                  Delete
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </ReviewCardDivision>
                    </ReviewCard>
                  ))}
                </ReviewContainer>
              ) : (
                <ReviewWritingContainer>
                  <Typography variant="h6">
                    No Reviews Found. Add a review.
                  </Typography>
                </ReviewWritingContainer>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewService;

const ServiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  // margin: 80px 20px;
  margin: 6rem;
  justify-content: center;
  align-items: center;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ServiceImage = styled.img`
  max-width: 300px;
  /* width: 50%; */
  margin-bottom: 20px;
`;

const ServiceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ServiceName = styled.h1`
  font-size: 24px;
`;

const PriceContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const PriceMrp = styled.p`
  margin-top: 8px;
  text-decoration: line-through;
  color: #525050;
`;

const PriceCost = styled.h3`
  margin-top: 8px;
`;

const PriceDiscount = styled.p`
  margin-top: 8px;
  color: darkgreen;
`;

const Description = styled.p`
  margin-top: 16px;
  text-align: justify;
`;

const ServiceDetails = styled.div`
  margin: 16px;
`;

const ButtonContainer = styled.div`
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReviewWritingContainer = styled.div`
  margin: 6rem;
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ReviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
  && {
    background-color: white;
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #000;
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewDetails = styled.div`
  flex: 1;
`;
