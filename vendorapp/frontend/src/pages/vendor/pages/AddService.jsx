import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import Popup from "../../../components/Popup";
import { BlueButton } from "../../../utils/buttonStyles";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userHandle";
import altImage from "../../../assets/altimg.png";
import styled from "styled-components";
import { Dialog } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AddService = () => {
  const dispatch = useDispatch();

  const { currentUser, status, response, error } = useSelector(
    (state) => state.user
  );

  const [serviceName, setServiceName] = useState("");
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const vendor = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
    vendor,
  };

  const [errorMessage, setErrorMessage] = useState("");

  // Modify the submit handler to prevent form submission if there are errors
  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    console.log(fields);
    // dispatch(addStuff("ServiceCreate", fields));
    // event.preventDefault();

    // Validate all fields before submitting
    validateServiceName(serviceName);
    validateDescription(description);
    validateMrp(mrp);
    validateSpecialPrice(cost);
    validateDiscountPercent(discountPercent);

    // Only submit if there are no errors
    if (
      !serviceNameError &&
      !descriptionError &&
      !mrpError &&
      !specialPriceError &&
      !discountPercentError
    ) {
      setLoader(true);
      console.log(fields);
      dispatch(addStuff("ServiceCreate", fields));
    } else {
      setErrorMessage("Please enter all required fields correctly");
    }
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Please enter all required fields correctly");
      setShowPopup(true);
    }
  }, [status, response, error]);

  // Add state for error messages
  const [serviceNameError, setServiceNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [mrpError, setMrpError] = useState("");
  const [specialPriceError, setSpecialPriceError] = useState("");
  const [discountPercentError, setDiscountPercentError] = useState("");

  // Add validation functions
  const validateServiceName = (value) => {
    if (value.trim() === "") {
      setServiceNameError("Service name is required");
    } else if (!isNaN(value)) {
      setServiceNameError("Service name cannot be a number");
    } else {
      setServiceNameError("");
    }
  };

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
      setMrpError("Average Cost is required");
    } else if (isNaN(value)) {
      setMrpError("Average Cost must be a number");
    } else {
      setMrpError("");
    }
  };

  const validateSpecialPrice = (value) => {
    if (value === null || value === undefined || value === "") {
      setSpecialPriceError("Special Price is required");
    } else if (isNaN(value)) {
      setSpecialPriceError("Special Price must be a number");
    } else if (value < 0) {
      setSpecialPriceError("Special Price must be positive");
    } else {
      setSpecialPriceError("");
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
  return (
    <>
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
          {errorMessage && (
            <Dialog open={true}>
              <DialogTitle>{errorMessage}</DialogTitle>
            </Dialog>
          )}
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              {serviceImage ? (
                <ServiceImage src={serviceImage} alt="" />
              ) : (
                <ServiceImage src={altImage} alt="" />
              )}
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Service Image URL"
                  value={serviceImage}
                  onChange={(event) => setServiceImage(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Service Name"
                  value={serviceName}
                  onChange={(event) => {
                    setServiceName(event.target.value);
                    validateServiceName(event.target.value);
                  }}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {serviceNameError && (
                  <div
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {serviceNameError}
                  </div>
                )}
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
                  label="Average Cost"
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
                  label="Special Price"
                  value={cost}
                  onChange={(event) => {
                    setCost(event.target.value);
                    validateSpecialPrice(event.target.value);
                  }}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {specialPriceError && (
                  <div
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {specialPriceError}
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
                    onChange={(event) => setCategory(event.target.value)}
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
                  onChange={(event) => setSubcategory(event.target.value)}
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

              <Box display="flex" justifyContent="center" marginTop={5}>
                <BlueButton
                  fullWidth
                  size="large"
                  sx={{ mt: 5 }}
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Add"
                  )}
                </BlueButton>
              </Box>
            </form>
          </div>
        </Box>
      </Box>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddService;

const ServiceImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
`;
