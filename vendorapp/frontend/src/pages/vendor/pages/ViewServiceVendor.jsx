import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  BlueButton,
  DarkRedButton,
  GreenButton,
} from "../../../utils/buttonStyles";
import {
  deleteStuff,
  getServiceDetails,
  updateStuff,
} from "../../../redux/userHandle";
import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
import altImage from "../../../assets/altimg.png";
import Popup from "../../../components/Popup";
import { generateRandomColor, timeAgo } from "../../../utils/helperFunctions";
import { underControl } from "../../../redux/userSlice";
import AlertDialogSlide from "../../../components/AlertDialogSlide";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@mui/material/Button";

const ViewServiceVendor = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const serviceID = params.id;

  const [showTab, setShowTab] = useState(false);
  const buttonText = showTab ? "Cancel" : "Edit service details";

  useEffect(() => {
    dispatch(getServiceDetails(serviceID));
  }, [serviceID, dispatch]);

  const { loading, status, error, serviceDetails, responseDetails } =
    useSelector((state) => state.user);

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState({});
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  console.log(price);

  useEffect(() => {
    if (serviceDetails) {
      setServiceName(serviceDetails.serviceName || "");
      setPrice(serviceDetails.price || "");
      setSubcategory(serviceDetails.subcategory || "");
      setServiceImage(serviceDetails.serviceImage || "");
      setCategory(serviceDetails.category || "");
      setDescription(serviceDetails.description || "");
      setTagline(serviceDetails.tagline || "");
    }
    if (serviceDetails.price) {
      setMrp(serviceDetails.price.mrp || "");
      setCost(serviceDetails.price.cost || "");
      setDiscountPercent(serviceDetails.price.discountPercent || "");
    }
  }, [serviceDetails]);

  const fields = {
    serviceName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    serviceImage,
    category,
    description,
    tagline,
  };
  const [errorMessage, setErrorMessage] = useState("");
  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    // dispatch(updateStuff(fields, serviceID, "ServiceUpdate"));
    // Validate all fields before submitting
    validateDescription(description);
    validateMrp(mrp);
    validateCost(cost);
    validateDiscountPercent(discountPercent);

    // Only submit if there are no errors
    if (!descriptionError && !mrpError && !costError && !discountPercentError) {
      dispatch(updateStuff(fields, serviceID, "ServiceUpdate"));
    } else {
      setErrorMessage("Please update all required fields correctly");
    }
  };

  const deleteHandler = (reviewId) => {
    console.log(reviewId);

    const fields = { reviewId };

    dispatch(updateStuff(fields, serviceID, "deleteServiceReview"));
  };

  const deleteAllHandler = () => {
    dispatch(deleteStuff(serviceID, "deleteAllServiceReviews"));
  };

  useEffect(() => {
    if (status === "updated" || status === "deleted") {
      setLoader(false);
      dispatch(getServiceDetails(serviceID));
      setShowPopup(true);
      setMessage("Done Successfully");
      setShowTab(false);
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, error, dispatch, serviceID]);

  // Add state for error messages
  const [descriptionError, setDescriptionError] = useState("");
  const [mrpError, setMrpError] = useState("");
  const [costError, setCostError] = useState("");
  const [discountPercentError, setDiscountPercentError] = useState("");

  // Add validation functions
  const validateDescription = (value) => {
    if (value.trim() === "") {
      setDescriptionError("Description is required");
    } else if (value.length < 10) {
      setDescriptionError("Description must be at least 10 characters long");
    } else {
      setDescriptionError("");
    }
  };

  const validateMrp = (value) => {
    if (value === null || value === undefined || value === "") {
      setMrpError("MRP is required");
    } else if (isNaN(value)) {
      setMrpError("MRP must be a number");
    } else if (value < 0) {
      setMrpError("MRP must be positive");
    } else {
      setMrpError("");
    }
  };

  const validateCost = (value) => {
    if (value === null || value === undefined || value === "") {
      setCostError("Cost is required");
    } else if (isNaN(value)) {
      setCostError("Cost must be a number");
    } else if (value < 0) {
      setCostError("Cost must be positive");
    } else {
      setCostError("");
    }
  };

  const validateDiscountPercent = (value) => {
    if (value === null || value === undefined || value === "") {
      setDiscountPercentError("Discount Percent is required");
    } else if (isNaN(value)) {
      setDiscountPercentError("Discount Percent must be a number");
    } else if (value < 0 || value > 100) {
      setDiscountPercentError("Discount Percent must be between 0 and 100");
    } else {
      setDiscountPercentError("");
    }
  };

  const categories = [
    "Attire",
    "Venue",
    "Florist",
    "Caterer",
    "Beautician",
    "Transport Provider",
    "Entertainment Provider",
    "Other",
  ];

  //  generatePDF function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Define the columns for  table
    const tableColumn = [
      "Service Name",
      "MRP",
      "Cost",
      "Discount",
      "Description",
      "Category",
      "Subcategory",
    ];

    // Extract the data from  serviceDetails
    const tableRows = [
      [
        serviceDetails.serviceName,
        serviceDetails.price.mrp,
        serviceDetails.price.cost,
        serviceDetails.price.discountPercent,
        serviceDetails.description,
        serviceDetails.category,
        serviceDetails.subcategory,
      ],
    ];

    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    doc.text("Vendor Service Report", 14, 15);

    // Save the PDF
    doc.save("Vendor_Service_Report.pdf");
  };

  return (
    <>
      {loading ? (
        <Dialog open={true}>
          <DialogTitle>Loading</DialogTitle>
        </Dialog>
      ) : (
        <>
          {responseDetails ? (
            <Dialog open={true}>
              <DialogTitle>Service not found</DialogTitle>
            </Dialog>
          ) : (
            <>
              {errorMessage && (
                <Dialog open={true}>
                  <DialogTitle>{errorMessage}</DialogTitle>
                </Dialog>
              )}
              <div>
                <Button
                  variant="contained"
                  onClick={generatePDF}
                  size="small"
                  style={{
                    margin: "20px",
                    float: "right",
                    backgroundColor: "#2f2b80",
                  }}
                >
                  Generate Report
                </Button>
              </div>
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
                    <Description>
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

              <ButtonContainer>
                <GreenButton onClick={() => setShowTab(!showTab)}>
                  {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  {buttonText}
                </GreenButton>
              </ButtonContainer>

              <Collapse in={showTab} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    flex: "1 1 auto",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: 550,
                      px: 3,
                      py: "30px",
                      width: "100%",
                    }}
                  >
                    <div>
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        {serviceImage ? (
                          <EditImage src={serviceImage} alt="" />
                        ) : (
                          <EditImage src={altImage} alt="" />
                        )}
                      </Stack>
                      <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            label="Service Image URL"
                            value={serviceImage}
                            onChange={(event) =>
                              setServiceImage(event.target.value)
                            }
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Service Name"
                            value={serviceName}
                            onChange={(event) =>
                              setServiceName(event.target.value)
                            }
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          <TextField
                            fullWidth
                            multiline
                            label="Description"
                            value={description}
                            onChange={(event) => {
                              setDescription(event.target.value);
                              validateDescription(event.target.value);
                            }}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {descriptionError && (
                            <div
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: "10px",
                              }}
                            >
                              {descriptionError}
                            </div>
                          )}
                          <TextField
                            fullWidth
                            label="MRP"
                            value={mrp}
                            onChange={(event) => {
                              setMrp(event.target.value);
                              validateMrp(event.target.value);
                            }}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {mrpError && (
                            <div
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: "10px",
                              }}
                            >
                              {mrpError}
                            </div>
                          )}
                          <TextField
                            fullWidth
                            label="Cost"
                            value={cost}
                            onChange={(event) => {
                              setCost(event.target.value);
                              validateCost(event.target.value);
                            }}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {costError && (
                            <div
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: "10px",
                              }}
                            >
                              {costError}
                            </div>
                          )}
                          <TextField
                            fullWidth
                            label="Discount Percent"
                            value={discountPercent}
                            onChange={(event) => {
                              setDiscountPercent(event.target.value);
                              validateDiscountPercent(event.target.value);
                            }}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {discountPercentError && (
                            <div
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: "10px",
                              }}
                            >
                              {discountPercentError}
                            </div>
                          )}
                          <FormControl fullWidth required>
                            <InputLabel shrink>Category</InputLabel>
                            <Select
                              value={category}
                              onChange={(event) =>
                                setCategory(event.target.value)
                              }
                            >
                              {categories.map((category) => (
                                <MenuItem value={category} key={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label="Subcategory"
                            value={subcategory}
                            onChange={(event) =>
                              setSubcategory(event.target.value)
                            }
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Tagline"
                            value={tagline}
                            onChange={(event) => setTagline(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Stack>

                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop={5}
                        >
                          <BlueButton
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                          >
                            {loader ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Update"
                            )}
                          </BlueButton>
                        </Box>
                      </form>
                    </div>
                  </Box>
                </Box>
              </Collapse>

              <ReviewWritingContainer>
                <Typography variant="h4">Reviews</Typography>

                {serviceDetails.reviews &&
                  serviceDetails.reviews.length > 0 && (
                    <DarkRedButton
                      onClick={() => {
                        setDialog("Do you want to delete all notices ?");
                        setShowDialog(true);
                      }}
                    >
                      Remove All Reviews
                    </DarkRedButton>
                  )}
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
                        <IconButton
                          onClick={() => deleteHandler(review._id)}
                          sx={{ width: "4rem", p: 0 }}
                        >
                          <Delete color="error" sx={{ fontSize: "2rem" }} />
                        </IconButton>
                      </ReviewCardDivision>
                    </ReviewCard>
                  ))}
                </ReviewContainer>
              ) : (
                <ReviewWritingContainer>
                  <Typography variant="h6">No Reviews Found.</Typography>
                </ReviewWritingContainer>
              )}

              <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
              />
              <AlertDialogSlide
                dialog={dialog}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                taskHandler={deleteAllHandler}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewServiceVendor;

const ServiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  // margin: 20px;
  margin: 6.2rem;
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

const EditImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
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
