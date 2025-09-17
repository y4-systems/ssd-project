import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getPreferenceList } from "../../../redux/stableRelated/stableHandle";
import { updateGuestFields } from "../../../redux/guestRelated/guestHandle";

import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import { PurpleButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";

const GuestAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user
  );
  const { preferencesList } = useSelector((state) => state.stable);
  const { response, error, statestatus } = useSelector((state) => state.guest);
  const params = useParams();

  const [guestID, setGuestID] = useState("");
  const [preferenceName, setPreferenceName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Guest") {
      setGuestID(params.id);
      const stdID = params.id;
      dispatch(getUserDetails(stdID, "Guest"));
    } else if (situation === "Preference") {
      const { guestID, preferenceID } = params;
      setGuestID(guestID);
      dispatch(getUserDetails(guestID, "Guest"));
      setChosenSubName(preferenceID);
    }
  }, [situation]);

  useEffect(() => {
    if (userDetails && userDetails.stableName && situation === "Guest") {
      dispatch(
        getPreferenceList(userDetails.stableName._id, "TablePreferences")
      );
    }
  }, [dispatch, userDetails]);

  const changeHandler = (event) => {
    const selectedPreference = preferencesList.find(
      (preference) => preference.subName === event.target.value
    );
    setPreferenceName(selectedPreference.subName);
    setChosenSubName(selectedPreference._id);
  };

  const fields = { subName: chosenSubName, status, date };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateGuestFields(guestID, fields, "GuestAttendance"));
  };

  useEffect(() => {
    if (response) {
      setLoader(false);
      setShowPopup(true);
      setMessage(response);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("error");
    } else if (statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
  }, [response, statestatus, error]);

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
                py: "100px",
                width: "100%",
              }}
            >
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="h4">
                  Guest Name: {userDetails.name}
                </Typography>
                {currentUser.teachPreference && (
                  <Typography variant="h4">
                    Preference Name: {currentUser.teachPreference?.subName}
                  </Typography>
                )}
              </Stack>
              <form onSubmit={submitHandler}>
                <Stack spacing={3}>
                  {situation === "Guest" && (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Preference
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={preferenceName}
                        label="Choose an option"
                        onChange={changeHandler}
                        required
                      >
                        {preferencesList ? (
                          preferencesList.map((preference, index) => (
                            <MenuItem key={index} value={preference.subName}>
                              {preference.subName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="Select Preference">
                            Add Preferences For Attendance
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Attendance Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Choose an option"
                      onChange={(event) => setStatus(event.target.value)}
                      required
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <TextField
                      label="Select Date"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </FormControl>
                </Stack>

                <PurpleButton
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </PurpleButton>
              </form>
            </Box>
          </Box>
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </>
      )}
    </>
  );
};

export default GuestAttendance;
