import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getPreferenceList } from "../../../redux/stableRelated/stableHandle";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Typography,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  removeStuff,
  updateGuestFields,
} from "../../../redux/guestRelated/guestHandle";
import {
  calculateOverallAttendancePercentage,
  calculatePreferenceAttendancePercentage,
  groupAttendanceByPreference,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Popup from "../../../components/Popup";

const ViewGuest = () => {
  const [showTab, setShowTab] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const guestID = params.id;
  const address = "Guest";

  useEffect(() => {
    dispatch(getUserDetails(guestID, address));
  }, [dispatch, guestID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.stableName &&
      userDetails.stableName._id !== undefined
    ) {
      dispatch(
        getPreferenceList(userDetails.stableName._id, "TablePreferences")
      );
    }
  }, [dispatch, userDetails]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [stableName, setStableName] = useState("");
  const [guestEvent, setGuestEvent] = useState("");
  const [preferenceObliges, setPreferenceObliges] = useState("");
  const [preferenceAttendance, setPreferenceAttendance] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("table");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === "" ? { name, rollNum } : { name, rollNum, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setRollNum(userDetails.rollNum || "");
      setStableName(userDetails.stableName || "");
      setGuestEvent(userDetails.event || "");
      setPreferenceObliges(userDetails.examResult || "");
      setPreferenceAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser(fields, guestID, address))
      .then(() => {
        dispatch(getUserDetails(guestID, address));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);

    dispatch(deleteUser(guestID, address)).then(() => {
      navigate(-1);
      setMessage("Deleted Successfully");
    });
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(guestID, address));
    });
  };

  const removeSubAttendance = (subId) => {
    dispatch(updateGuestFields(guestID, { subId }, "RemoveGuestSubAtten")).then(
      () => {
        dispatch(getUserDetails(guestID, address));
      }
    );
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(preferenceAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const preferenceData = Object.entries(
    groupAttendanceByPreference(preferenceAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const preferenceAttendancePercentage =
      calculatePreferenceAttendancePercentage(present, sessions);
    return {
      preference: subName,
      attendancePercentage: preferenceAttendancePercentage,
      totalTablees: sessions,
      attendedTablees: present,
    };
  });

  const GuestAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3
            style={{
              margin: "10px",
              textAlign: "center",
            }}
          >
            Attendance
          </h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Preference</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Total Event Sessions</StyledTableCell>
                <StyledTableCell>Attendance Percentage</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(
              groupAttendanceByPreference(preferenceAttendance)
            ).map(([subName, { present, allData, subId, sessions }], index) => {
              const preferenceAttendancePercentage =
                calculatePreferenceAttendancePercentage(present, sessions);
              return (
                <TableBody key={index}>
                  <StyledTableRow>
                    <StyledTableCell>{subName}</StyledTableCell>
                    <StyledTableCell>{present}</StyledTableCell>
                    <StyledTableCell>{sessions}</StyledTableCell>
                    <StyledTableCell>
                      {preferenceAttendancePercentage}%
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleOpen(subId)}
                      >
                        {openStates[subId] ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                        Details
                      </Button>
                      <IconButton onClick={() => removeSubAttendance(subId)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                      <Button
                        variant="contained"
                        sx={styles.attendanceButton}
                        onClick={() =>
                          navigate(
                            `/Admin/preference/guest/attendance/${guestID}/${subId}`
                          )
                        }
                      >
                        Change
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openStates[subId]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Attendance Details
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell align="right">
                                  Status
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {allData.map((data, index) => {
                                const date = new Date(data.date);
                                const dateString =
                                  date.toString() !== "Invalid Date"
                                    ? date.toISOString().substring(0, 10)
                                    : "Invalid Date";
                                return (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                      {dateString}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {data.status}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              );
            })}
          </Table>
          <div
            style={{
              margin: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Overall Attendance Percentage:{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeHandler(guestID, "RemoveGuestAtten")}
          >
            Delete All
          </Button>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/guests/guest/attendance/" + guestID)
            }
          >
            Add Attendance
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={preferenceData}
            dataKey="attendancePercentage"
          />
        </>
      );
    };
    return (
      <>
        {preferenceAttendance &&
        Array.isArray(preferenceAttendance) &&
        preferenceAttendance.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

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
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/guests/guest/attendance/" + guestID)
            }
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "auto",
              alignItems: "center",
            }}
          >
            Add Attendance
          </Button>
        )}
      </>
    );
  };

  const GuestObligesSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3
            style={{
              margin: "10px",
              textAlign: "center",
            }}
          >
            Obligations
          </h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Preference</StyledTableCell>
                <StyledTableCell>Obligation</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {preferenceObliges.map((result, index) => {
                if (!result.subName || !result.obligesObtained) {
                  return null;
                }
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                    <StyledTableCell>{result.obligesObtained}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() => navigate("/Admin/guests/guest/obliges/" + guestID)}
          >
            Add Obligation
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={preferenceObliges}
            dataKey="obligesObtained"
          />
        </>
      );
    };
    return (
      <>
        {preferenceObliges &&
        Array.isArray(preferenceObliges) &&
        preferenceObliges.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

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
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() => navigate("/Admin/guests/guest/obliges/" + guestID)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            Add Obligation
          </Button>
        )}
      </>
    );
  };

  const GuestDetailsSection = () => {
    return (
      <div>
        <h4>
          <center>Guest Details</center>
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Name: {userDetails.name}
          <br />
          Seat No: {userDetails.rollNum}
          <br />
          Table: {stableName.stableName}
          <br />
          Event {guestEvent.eventName}
          {preferenceAttendance &&
            Array.isArray(preferenceAttendance) &&
            preferenceAttendance.length > 0 && (
              <CustomPieChart data={chartData} />
            )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={deleteHandler}
          >
            Remove Guest
          </Button>
          <br />
          <Button
            variant="contained"
            sx={styles.styledButton}
            className="show-tab"
            onClick={() => {
              setShowTab(!showTab);
            }}
          >
            {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            Edit Guest
          </Button>
        </div>
        <Collapse in={showTab} timeout="auto" unmountOnExit>
          <div className="register">
            <form className="registerForm" onSubmit={submitHandler}>
              <h2>
                <center>Edit Guest</center>
              </h2>

              <label>Name</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter user's name..."
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />

              <label>Seat Number</label>
              <input
                className="registerInput"
                type="number"
                placeholder="Enter user's Seat Number..."
                value={rollNum}
                onChange={(event) => setRollNum(event.target.value)}
                required
              />

              <label>ID Number</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter user's ID Number"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />

              <button
                className="registerButton"
                type="submit"
                style={{ backgroundColor: "#4d1c9c" }}
              >
                Update
              </button>
            </form>
          </div>
        </Collapse>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <>
          <div>
            {" "}
            <Dialog open={true}>
              <DialogTitle>Loading</DialogTitle>
            </Dialog>
          </div>
        </>
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
                  <Tab label="Attendance" value="2" />
                  <Tab label="Obligation" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <GuestDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <GuestAttendanceSection />
                </TabPanel>
                <TabPanel value="3">
                  <GuestObligesSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ViewGuest;

const styles = {
  attendanceButton: {
    marginLeft: "20px",
    backgroundColor: "#270843",
    "&:hover": {
      backgroundColor: "#3f1068",
    },
  },
  styledButton: {
    margin: "20px",
    backgroundColor: "#02250b",
    "&:hover": {
      backgroundColor: "#106312",
    },
  },
};
