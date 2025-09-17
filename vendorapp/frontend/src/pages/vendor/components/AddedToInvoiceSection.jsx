import { useDispatch, useSelector } from "react-redux";
import { getSpecificServices } from "../../../redux/userHandle";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BlueButton, GreenButton } from "../../../utils/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { useNavigate } from "react-router-dom";

const AddedToInvoiceSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, specificServiceData, responseSpecificServices } =
    useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSpecificServices(currentUser._id, "getAddedToInvoiceServices"));
  }, [dispatch, currentUser._id]);

  const servicesColumns = [
    { id: "name", label: "Service Name", minWidth: 170 },
    { id: "quantity", label: "Service Quantity", minWidth: 100 },
    { id: "category", label: "Service Category", minWidth: 100 },
    { id: "subcategory", label: "Service SubCategory", minWidth: 100 },
  ];

  const servicesRows =
    Array.isArray(specificServiceData) && specificServiceData.length > 0
      ? specificServiceData.map((service) => ({
          name: service.serviceName,
          quantity: service.quantity,
          category: service.category,
          subcategory: service.subcategory,
          id: service.serviceName,
          serviceID: service.serviceID,
        }))
      : [];

  const ServicesButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          onClick={() => {
            navigate("/Vendor/bookings/service/" + row.serviceID);
          }}
        >
          View Service
        </BlueButton>
        <GreenButton
          onClick={() => {
            navigate("/Vendor/bookings/couples/" + row.serviceID);
          }}
        >
          Show Couples
        </GreenButton>
      </>
    );
  };

  return (
    <>
      {responseSpecificServices ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Vendor/addservice")}
          >
            Add Services
          </GreenButton>
        </Box>
      ) : (
        <>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ marginBottom: "25px" }}
          >
            List of Services
          </Typography>

          <TableTemplate
            buttonHaver={ServicesButtonHaver}
            columns={servicesColumns}
            rows={servicesRows}
          />
        </>
      )}
    </>
  );
};

export default AddedToInvoiceSection;
