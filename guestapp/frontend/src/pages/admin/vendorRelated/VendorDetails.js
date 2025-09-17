import React, { useEffect } from "react";
import { getVendorDetails } from "../../../redux/vendorRelated/vendorHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Typography } from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
const VendorDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, vendorDetails, error } = useSelector(
    (state) => state.vendor
  );

  const vendorID = params.id;

  useEffect(() => {
    dispatch(getVendorDetails(vendorID));
  }, [dispatch, vendorID]);

  if (error) {
    console.log(error);
  }

  const isPreferenceNamePresent = vendorDetails?.teachPreference?.subName;

  const handleAddPreference = () => {
    navigate(
      `/Admin/vendors/choosepreference/${vendorDetails?.teachStable?._id}/${vendorDetails?._id}`
    );
  };

  return (
    <>
      {loading ? (
        <div>
          {" "}
          <Dialog open={true}>
            <DialogTitle>Loading</DialogTitle>
          </Dialog>
        </div>
      ) : (
        <Container>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ marginTop: "50px" }}
          >
            Vendor Details
          </Typography>
          <Typography variant="h6" gutterBottom>
            Vendor Name: {vendorDetails?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Table Name: {vendorDetails?.teachStable?.stableName}
          </Typography>
          {isPreferenceNamePresent ? (
            <>
              <Typography variant="h6" gutterBottom>
                Preference Name: {vendorDetails?.teachPreference?.subName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Preference Sessions: {vendorDetails?.teachPreference?.sessions}
              </Typography>
            </>
          ) : (
            <Button variant="contained" onClick={handleAddPreference}>
              Add Preference
            </Button>
          )}
        </Container>
      )}
    </>
  );
};

export default VendorDetails;
