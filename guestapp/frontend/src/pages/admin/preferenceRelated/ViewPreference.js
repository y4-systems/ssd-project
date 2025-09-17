import React, { useEffect, useState } from "react";
import {
  getTableGuests,
  getPreferenceDetails,
} from "../../../redux/stableRelated/stableHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tab,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";

import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

const ViewPreference = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, preferenceDetails, stableGuests, getresponse, error } =
    useSelector((state) => state.stable);

  const { tableID, preferenceID } = params;

  useEffect(() => {
    dispatch(getPreferenceDetails(preferenceID, "Preference"));
    dispatch(getTableGuests(tableID));
  }, [dispatch, preferenceID, tableID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("attendance");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const guestColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const guestRows = stableGuests.map((guest) => {
    return {
      rollNum: guest.rollNum,
      name: guest.name,
      id: guest._id,
    };
  });

  const GuestsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(
              `/Admin/preference/guest/attendance/${row.id}/${preferenceID}`
            )
          }
        >
          Take Attendance
        </PurpleButton>
      </>
    );
  };

  const GuestsObligesButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(
              `/Admin/preference/guest/obliges/${row.id}/${preferenceID}`
            )
          }
        >
          Oblige
        </PurpleButton>
      </>
    );
  };

  const PreferenceGuestsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/table/addguests/" + tableID)}
              >
                Add Guests
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom sx={{ marginTop: "10px" }}>
              <center>Guests List</center>
            </Typography>

            {selectedSection === "attendance" && (
              <div style={{ margin: "50px" }}>
                <TableTemplate
                  buttonHaver={GuestsAttendanceButtonHaver}
                  columns={guestColumns}
                  rows={guestRows}
                />
              </div>
            )}
            {selectedSection === "obliges" && (
              <div style={{ margin: "50px" }}>
                <TableTemplate
                  buttonHaver={GuestsObligesButtonHaver}
                  columns={guestColumns}
                  rows={guestRows}
                />
              </div>
            )}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={
                    selectedSection === "attendance" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Obligation"
                  value="obliges"
                  icon={
                    selectedSection === "obliges" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </>
    );
  };

  const PreferenceDetailsSection = () => {
    const numberOfGuests = stableGuests.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Preference Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Preference Name : {preferenceDetails && preferenceDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Preference Category : {preferenceDetails && preferenceDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Preference Sessions :{" "}
          {preferenceDetails && preferenceDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Guests: {numberOfGuests}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Table Name :{" "}
          {preferenceDetails &&
            preferenceDetails.stableName &&
            preferenceDetails.stableName.stableName}
        </Typography>
        {preferenceDetails && preferenceDetails.vendor ? (
          <Typography variant="h6" gutterBottom>
            Vendor Name : {preferenceDetails.vendor.name}
          </Typography>
        ) : (
          <GreenButton
            variant="contained"
            onClick={() =>
              navigate("/Admin/vendors/addvendor/" + preferenceDetails._id)
            }
          >
            Assign Vendor
          </GreenButton>
        )}
      </>
    );
  };

  return (
    <>
      {subloading ? (
        <div>
          {" "}
          <Dialog open={true}>
            <DialogTitle>Loading</DialogTitle>
          </Dialog>
        </div>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  centered
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Guests" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <PreferenceDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <PreferenceGuestsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
};

export default ViewPreference;
