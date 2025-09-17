import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddedToInvoiceSection from "../components/AddedToInvoiceSection";
import OutForDeliverySection from "../components/OutForDeliverySection";

const ShowBookings = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          bbookingBottom: 1,
          bbookingColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Added To Invoice" {...a11yProps(0)} />
          <Tab label="Reserved for Bookings" {...a11yProps(1)} />
          <Tab label="Completed Bookings" {...a11yProps(2)} />
          <Tab label="Cancelled Bookings" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddedToInvoiceSection />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <OutForDeliverySection />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div style={{ textAlign: "center", margin: "auto" }}>
          0 Completed Bookings
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div style={{ textAlign: "center", margin: "auto" }}>
          0 Cancelled Bookings
        </div>
      </CustomTabPanel>
    </Box>
  );
};

export default ShowBookings;

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
