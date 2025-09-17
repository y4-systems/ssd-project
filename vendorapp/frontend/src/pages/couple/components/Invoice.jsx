import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import {
  addToInvoice,
  removeAllFromInvoice,
  removeFromInvoice,
} from "../../../redux/userSlice";
import { BasicButton, LightPurpleButton } from "../../../utils/buttonStyles";
import { useNavigate } from "react-router-dom";
import { updateCouple } from "../../../redux/userHandle";

const emptyInvoice = "";
const Invoice = ({ setIsInvoiceOpen }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  let invoiceDetails = currentUser.invoiceDetails;

  const handleRemoveFromInvoice = (service) => {
    dispatch(removeFromInvoice(service));
  };

  const handleAddToInvoice = (service) => {
    dispatch(addToInvoice(service));
  };

  const handleRemoveAllFromInvoice = () => {
    dispatch(removeAllFromInvoice());
  };

  const totalQuantity = invoiceDetails.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalOGPrice = invoiceDetails.reduce(
    (total, item) => total + item.quantity * item.price.mrp,
    0
  );
  const totalNewPrice = invoiceDetails.reduce(
    (total, item) => total + item.quantity * item.price.cost,
    0
  );

  const serviceViewHandler = (serviceID) => {
    navigate("/service/view/" + serviceID);
    setIsInvoiceOpen(false);
  };

  const serviceBuyingHandler = (id) => {
    console.log(currentUser);
    dispatch(updateCouple(currentUser, currentUser._id));
    setIsInvoiceOpen(false);
    navigate(`/service/buy/${id}`);
  };

  const allServicesBuyingHandler = () => {
    console.log(currentUser);
    dispatch(updateCouple(currentUser, currentUser._id));
    setIsInvoiceOpen(false);
    navigate("/Checkout");
  };

  const priceContainerRef = useRef(null);

  const handleScrollToBottom = () => {
    if (priceContainerRef.current) {
      priceContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const firstInvoiceItemRef = useRef(null);

  const handleScrollToTop = () => {
    if (firstInvoiceItemRef.current) {
      firstInvoiceItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <StyledContainer>
      <TopContainer>
        <LightPurpleButton
          onClick={() => {
            setIsInvoiceOpen(false);
          }}
        >
          <KeyboardDoubleArrowLeftIcon /> Continue Browsing
        </LightPurpleButton>
        {invoiceDetails.length > 0 && (
          <IconButton
            sx={{ backgroundColor: "#3a3939", color: "white" }}
            onClick={handleScrollToTop}
          >
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        )}
      </TopContainer>
      {invoiceDetails.length === 0 ? (
        <InvoiceImage src={emptyInvoice} />
      ) : (
        <CardGrid container spacing={2}>
          {invoiceDetails.map((data, index) => (
            <Grid
              item
              xs={12}
              key={index}
              ref={index === 0 ? firstInvoiceItemRef : null}
            >
              <InvoiceItem>
                <ServiceImage src={data.serviceImage} />
                <ServiceDetails>
                  <Typography variant="h6">{data.serviceName}</Typography>
                  <Typography variant="subtitle2">
                    Original Price: LKR {data.price.mrp}
                  </Typography>
                  <Typography variant="subtitle2">
                    Discount: {data.price.discountPercent}% Off
                  </Typography>
                  <Typography variant="subtitle2">
                    Final Price: LKR {data.price.cost}
                  </Typography>
                  <Typography variant="subtitle2">
                    Quantity: {data.quantity}
                  </Typography>
                  <Typography variant="subtitle2">
                    Total: LKR {data.quantity * data.price.cost}
                  </Typography>
                  <ButtonContainer>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFromInvoice(data)}
                    >
                      -1
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleAddToInvoice(data)}
                    >
                      +1
                    </Button>
                  </ButtonContainer>
                  <ButtonContainer>
                    <BasicButton
                      sx={{ mt: 2 }}
                      onClick={() => serviceViewHandler(data._id)}
                    >
                      View
                    </BasicButton>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 2 }}
                      onClick={() => serviceBuyingHandler(data._id)}
                    >
                      Buy
                    </Button>
                  </ButtonContainer>
                </ServiceDetails>
              </InvoiceItem>
            </Grid>
          ))}
          <StyledPaper ref={priceContainerRef}>
            <Title>
              <center>PRICE DETAILS</center>
            </Title>
            <Divider sx={{ my: 1 }} />
            <DetailsContainer>
              Price ({totalQuantity} items) = LKR {totalOGPrice}
              <br />
              <br />
              Discount = LKR {totalOGPrice - totalNewPrice}
              <Divider sx={{ my: 1 }} />
              Total Amount = LKR {totalNewPrice}
            </DetailsContainer>
            <Divider sx={{ my: 1, mb: 4 }} />
            {invoiceDetails.length > 0 && (
              <Button
                variant="contained"
                color="success"
                onClick={allServicesBuyingHandler}
              >
                Buy All
              </Button>
            )}
          </StyledPaper>
        </CardGrid>
      )}

      {invoiceDetails.length > 0 && (
        <BottomContainer>
          <Button
            variant="contained"
            color="success"
            onClick={handleScrollToBottom}
            size="small"
          >
            View Bill
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveAllFromInvoice}
            size="small"
          >
            Remove All
          </Button>
        </BottomContainer>
      )}
    </StyledContainer>
  );
};

export default Invoice;

const StyledContainer = styled(Container)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 16px;
  background-color: #f8f8f8;
  z-index: 1;
`;

const StyledPaper = styled(Paper)`
  padding: 26px;
  display: flex;
  margin-top: 2rem;
  margin-bottom: 2rem;
  flex-direction: column;
  height: 30vh;
`;

const CardGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const DetailsContainer = styled.div`
  margin-top: 1rem;
`;

const InvoiceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f5f5;
  bbooking-radius: 4px;
`;

const InvoiceImage = styled.img`
  width: 100%;
`;

const ServiceImage = styled.img`
  width: 100px;
  height: auto;
  margin-right: 16px;
`;

const ServiceDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  padding: 16px;
  background-color: #f8f8f8;
`;
