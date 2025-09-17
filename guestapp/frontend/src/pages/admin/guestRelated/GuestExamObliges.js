import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getPreferenceList } from "../../../redux/stableRelated/stableHandle";
import { updateGuestFields } from "../../../redux/guestRelated/guestHandle";

import Popup from "../../../components/Popup";
import { BlueButton } from "../../../components/buttonStyles";
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

const GuestExamObliges = ({ situation }) => {
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
  const [obligesObtained, setObligesObtained] = useState("");

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

  const fields = { subName: chosenSubName, obligesObtained };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateGuestFields(guestID, fields, "UpdateExamResult"));
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
          {/* <div>Loading...</div> */}
          <Dialog open={true}>
            <DialogTitle>Loading</DialogTitle>
          </Dialog>
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
                            Add Preferences For Obligations
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl>
                    <TextField
                      type="number"
                      label="Obligation(Out of 5)"
                      value={obligesObtained}
                      required
                      onChange={(e) => setObligesObtained(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </FormControl>
                </Stack>
                <BlueButton
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
                </BlueButton>
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

export default GuestExamObliges;
