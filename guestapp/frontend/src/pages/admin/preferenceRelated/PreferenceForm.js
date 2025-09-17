import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";

const PreferenceForm = () => {
  const [preferences, setPreferences] = useState([
    { subName: "", subCode: "", sessions: "" },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;

  const stableName = params.id;
  const adminID = currentUser._id;
  const address = "Preference";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handlePreferenceNameChange = (index) => (event) => {
    const newPreferences = [...preferences];
    newPreferences[index].subName = event.target.value;
    setPreferences(newPreferences);
  };

  const handlePreferenceCodeChange = (index) => (event) => {
    const newPreferences = [...preferences];
    newPreferences[index].subCode = event.target.value;
    setPreferences(newPreferences);
  };

  const handleSessionsChange = (index) => (event) => {
    const newPreferences = [...preferences];
    newPreferences[index].sessions = event.target.value || 0;
    setPreferences(newPreferences);
  };

  const handleAddPreference = () => {
    setPreferences([...preferences, { subName: "", subCode: "" }]);
  };

  const handleRemovePreference = (index) => () => {
    const newPreferences = [...preferences];
    newPreferences.splice(index, 1);
    setPreferences(newPreferences);
  };

  const fields = {
    stableName,
    preferences: preferences.map((preference) => ({
      subName: preference.subName,
      subCode: preference.subCode,
      sessions: preference.sessions,
    })),
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/preferences");
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <form onSubmit={submitHandler}>
      <Box mb={2} mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6">Add Preferences</Typography>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {preferences.map((preference, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preference Name"
                variant="outlined"
                value={preference.subName}
                onChange={handlePreferenceNameChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Preference Category"
                variant="outlined"
                value={preference.subCode}
                onChange={handlePreferenceCodeChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Sessions"
                variant="outlined"
                type="number"
                inputProps={{ min: 0 }}
                value={preference.sessions}
                onChange={handleSessionsChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="flex-end">
                {index === 0 ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddPreference}
                  >
                    Add Preference
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemovePreference(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loader}
              sx={{ marginRight: "120px" }}
            >
              {loader ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
          </Box>
        </Grid>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Grid>
    </form>
  );
};

export default PreferenceForm;

const styles = {
  inputField: {
    "& .MuiInputLabel-root": {
      color: "#838080",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#838080",
    },
  },
};
