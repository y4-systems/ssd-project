import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  BasicButton,
  BrownButton,
  DarkRedButton,
  IndigoButton,
} from "../../../utils/buttonStyles.js";
import { useNavigate } from "react-router-dom";
import { deleteStuff, getServicesbyVendor } from "../../../redux/userHandle.js";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate.jsx";
import AddCardIcon from "@mui/icons-material/AddCard";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import AlertDialogSlide from "../../../components/AlertDialogSlide.jsx";
import { Dialog, DialogTitle } from "@mui/material";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@mui/material/Button";

const ShowServices = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    currentUser,
    currentRole,
    loading,
    vendorServiceData,
    responseVendorServices,
  } = useSelector((state) => state.user);

  const vendorID = currentUser._id;

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getServicesbyVendor(currentUser._id));
  }, [dispatch, currentUser._id]);

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteStuff(deleteID, address)).then(() => {
      dispatch(getServicesbyVendor(currentUser._id));
    });
  };

  const deleteAllServices = () => {
    deleteHandler(vendorID, "DeleteServices");
  };

  const actions = [
    {
      icon: <AddCardIcon color="primary" />,
      name: "Add New Service",
      action: () => navigate("/Vendor/addservice"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Services",
      action: () => {
        setDialog("Do you want to delete all services ?");
        setShowDialog(true);
      },
    },
  ];

  const shopinvoiceActions = [
    {
      icon: <AddCardIcon color="primary" />,
      name: "Add New Service",
      action: () => navigate("/Vendor/addservice"),
    },
    {
      icon: <UploadIcon color="success" />,
      name: "Upload New Service",
      action: () => navigate("/Vendor/uploadservices"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Services",
      action: () => {
        setDialog("Do you want to delete all services ?");
        setShowDialog(true);
      },
    },
  ];

  //  generatePDF function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Define the columns
    const tableColumn = ["Service Name", "MRP", "Cost", "Discount"];

    // Extract the data from  vendorServiceData
    const tableRows = vendorServiceData.map((service) => [
      service.serviceName,
      service.price.mrp,
      service.price.cost,
      service.price.discountPercent,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    doc.text("Vendor Service Report", 14, 15);

    // Save the PDF
    doc.save("Vendor_Service_Report.pdf");
  };

  return (
    <>
      {loading ? (
        <div>
          <Dialog open={true}>
            <DialogTitle>Loading...</DialogTitle>
          </Dialog>
        </div>
      ) : (
        <>
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
          {responseVendorServices ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <IndigoButton onClick={() => navigate("/Vendor/addservice")}>
                Add Service
              </IndigoButton>
              <br />
              <br />
              {currentRole === "Shopinvoice" && (
                <BrownButton onClick={() => navigate("/Vendor/uploadservices")}>
                  Upload Service
                </BrownButton>
              )}
            </Box>
          ) : (
            <>
              {Array.isArray(vendorServiceData) &&
                vendorServiceData.length > 0 && (
                  <div style={{ marginTop: "50px" }}>
                    <ServiceGrid container spacing={3}>
                      {vendorServiceData.map((data, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <ServiceContainer>
                            <ServiceImage src={data.serviceImage} />
                            <ServiceName>{data.serviceName}</ServiceName>
                            <PriceMrp>{data.price.mrp}</PriceMrp>
                            <PriceCost>LKR {data.price.cost}</PriceCost>
                            <PriceDiscount>
                              {data.price.discountPercent}% off
                            </PriceDiscount>
                            <ButtonContainer>
                              <DarkRedButton
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this service?"
                                    )
                                  ) {
                                    deleteHandler(data._id, "DeleteService");
                                  }
                                }}
                              >
                                Delete
                              </DarkRedButton>
                              <BasicButton
                                onClick={() =>
                                  navigate(
                                    "/Vendor/services/service/" + data._id
                                  )
                                }
                              >
                                View
                              </BasicButton>
                            </ButtonContainer>
                          </ServiceContainer>
                        </Grid>
                      ))}
                    </ServiceGrid>
                  </div>
                )}

              {currentRole === "Shopinvoice" ? (
                <SpeedDialTemplate actions={shopinvoiceActions} />
              ) : (
                <SpeedDialTemplate actions={actions} />
              )}
            </>
          )}
        </>
      )}
      <AlertDialogSlide
        dialog={dialog}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        taskHandler={deleteAllServices}
      />
    </>
  );
};

export default ShowServices;

const ServiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const ServiceGrid = styled(Grid)`
  display: flex;
  align-items: center;
`;

const ServiceImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
`;

const ServiceName = styled.p`
  font-weight: bold;
  text-align: center;
`;

const PriceMrp = styled.p`
  margin-top: 8px;
  text-align: center;
  text-decoration: line-through;
  color: #525050;
`;

const PriceCost = styled.h3`
  margin-top: 8px;
  text-align: center;
`;

const PriceDiscount = styled.p`
  margin-top: 8px;
  text-align: center;
  color: darkgreen;
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
`;
