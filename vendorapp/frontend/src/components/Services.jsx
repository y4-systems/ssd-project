import React, { useState } from "react";
import { Container, Grid, Pagination } from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addToInvoice } from "../redux/userSlice";
import { BasicButton } from "../utils/buttonStyles";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { addStuff } from "../redux/userHandle";

const Services = ({ serviceData }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const itemsPerPage = 9;

  const { currentRole, responseSearch } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = serviceData.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToInvoice = (event, service) => {
    event.stopPropagation();
    dispatch(addToInvoice(service));
  };

  const handleUpload = (event, service) => {
    event.stopPropagation();
    console.log(service);
    dispatch(addStuff("ServiceCreate", service));
  };

  const messageHandler = (event) => {
    event.stopPropagation();
    setMessage("You have to Login or Register first");
    setShowPopup(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (responseSearch) {
    return (
      <Dialog open={true}>
        <DialogTitle>Service not found</DialogTitle>
      </Dialog>
    );
  }

  return (
    <>
      <ServiceGrid container spacing={3}>
        {currentItems.map((data, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            onClick={() => navigate("/service/view/" + data._id)}
            sx={{ cursor: "pointer" }}
          >
            <ServiceContainer>
              <ServiceImage src={data.serviceImage} />
              <ServiceName>{data.serviceName}</ServiceName>
              <PriceMrp>{data.price.mrp}</PriceMrp>
              <PriceCost>LKR {data.price.cost}</PriceCost>
              <PriceDiscount>{data.price.discountPercent}% off</PriceDiscount>
              <AddToInvoice>
                {currentRole === "Couple" && (
                  <>
                    <BasicButton
                      onClick={(event) => handleAddToInvoice(event, data)}
                    >
                      Add To Invoice
                    </BasicButton>
                  </>
                )}
                {currentRole === "Shopinvoice" && (
                  <>
                    <BasicButton onClick={(event) => handleUpload(event, data)}>
                      Upload
                    </BasicButton>
                  </>
                )}
                {currentRole === null && (
                  <>
                    <BasicButton onClick={messageHandler}>
                      Add To Invoice
                    </BasicButton>
                  </>
                )}
              </AddToInvoice>
            </ServiceContainer>
          </Grid>
        ))}
      </ServiceGrid>

      <Container
        sx={{
          mt: 10,
          mb: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pagination
          count={Math.ceil(serviceData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
        />
      </Container>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default Services;

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

const AddToInvoice = styled.div`
  margin-top: 16px;
`;
