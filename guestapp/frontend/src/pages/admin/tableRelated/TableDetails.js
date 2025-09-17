import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTableDetails,
  getTableGuests,
  getPreferenceList,
} from "../../../redux/stableRelated/stableHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { Box, Container, Typography, Tab, IconButton } from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { resetPreferences } from "../../../redux/stableRelated/stableSlice";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";

const TableDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    preferencesList,
    stableGuests,
    stableDetails,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.stable);

  const tableID = params.id;

  useEffect(() => {
    dispatch(getTableDetails(tableID, "Stable"));
    dispatch(getPreferenceList(tableID, "TablePreferences"));
    dispatch(getTableGuests(tableID));
  }, [dispatch, tableID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getTableGuests(tableID));
      dispatch(resetPreferences());
      dispatch(getPreferenceList(tableID, "TablePreferences"));
      setMessage("Deleted Successfully");
    });
  };

  const preferenceColumns = [
    { id: "name", label: "Preference Name", minWidth: 170 },
    { id: "code", label: "Preference Category", minWidth: 100 },
  ];

  const preferenceRows =
    preferencesList &&
    preferencesList.length > 0 &&
    preferencesList.map((preference) => {
      return {
        name: preference.subName,
        code: preference.subCode,
        id: preference._id,
      };
    });

  const PreferencesButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Preference")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => {
            navigate(`/Admin/table/preference/${tableID}/${row.id}`);
          }}
        >
          View
        </BlueButton>
      </>
    );
  };

  const preferenceActions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Preference",
      action: () => navigate("/Admin/addpreference/" + tableID),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Preferences",
      action: () => deleteHandler(tableID, "PreferencesTable"),
    },
  ];

  const TablePreferencesSection = () => {
    return (
      <>
        {response ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/addpreference/" + tableID)}
            >
              Add Preferences
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Preferences List:
            </Typography>
            <div style={{ margin: "50px" }}>
              <TableTemplate
                buttonHaver={PreferencesButtonHaver}
                columns={preferenceColumns}
                rows={preferenceRows}
              />
            </div>
            <SpeedDialTemplate actions={preferenceActions} />
          </>
        )}
      </>
    );
  };

  const guestColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Seat Number", minWidth: 100 },
  ];

  const guestRows = stableGuests.map((guest) => {
    return {
      name: guest.name,
      rollNum: guest.rollNum,
      id: guest._id,
    };
  });

  const GuestsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Guest")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/attendance/" + row.id)}
        >
          Attendance
        </PurpleButton>
      </>
    );
  };

  const guestActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Guest",
      action: () => navigate("/Admin/table/addguests/" + tableID),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Guests",
      action: () => deleteHandler(tableID, "GuestsTable"),
    },
  ];

  const TableGuestsSection = () => {
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
            <div style={{ margin: "50px" }}>
              <TableTemplate
                buttonHaver={GuestsButtonHaver}
                columns={guestColumns}
                rows={guestRows}
              />
            </div>
            <SpeedDialTemplate actions={guestActions} />
          </>
        )}
      </>
    );
  };

  const TableVendorsSection = () => {
    return (
      <>
        <center>Vendors</center>
      </>
    );
  };

  const TableDetailsSection = () => {
    const numberOfPreferences = preferencesList.length;
    const numberOfGuests = stableGuests.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Table Details
        </Typography>
        <Typography variant="h5" gutterBottom>
          This is Table {stableDetails && stableDetails.stableName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Preferences: {numberOfPreferences}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Guests: {numberOfGuests}
        </Typography>
        {getresponse && (
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/table/addguests/" + tableID)}
          >
            Add Guests
          </GreenButton>
        )}
        {response && (
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/addpreference/" + tableID)}
          >
            Add Preferences
          </GreenButton>
        )}
      </>
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
                  <Tab label="Preferences" value="2" />
                  <Tab label="Guests" value="3" />
                  <Tab label="Vendors" value="4" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <TableDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <TablePreferencesSection />
                </TabPanel>
                <TabPanel value="3">
                  <TableGuestsSection />
                </TabPanel>
                <TabPanel value="4">
                  <TableVendorsSection />
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

export default TableDetails;
