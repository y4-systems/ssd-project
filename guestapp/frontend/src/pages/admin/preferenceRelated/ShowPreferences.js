import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPreferenceList } from "../../../redux/stableRelated/stableHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Paper, Box, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowPreferences = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { preferencesList, loading, error, response } = useSelector(
    (state) => state.stable
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getPreferenceList(currentUser._id, "AllPreferences"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getPreferenceList(currentUser._id, "AllPreferences"));
      setMessage("Deleted Successfully");
    });
  };

  const preferenceColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Event Session", minWidth: 170 },
    { id: "stableName", label: "Table", minWidth: 170 },
  ];

  const preferenceRows = preferencesList.map((preference) => {
    return {
      subName: preference.subName,
      sessions: preference.sessions,
      stableName: preference.stableName.stableName,
      stableID: preference.stableName._id,
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
          onClick={() =>
            navigate(`/Admin/preferences/preference/${row.stableID}/${row.id}`)
          }
        >
          View
        </BlueButton>
      </>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Preference",
      action: () => navigate("/Admin/preferences/choosetable"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Preferences",
      action: () => deleteHandler(currentUser._id, "Preferences"),
    },
  ];

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
                onClick={() => navigate("/Admin/preferences/choosetable")}
              >
                Add Preferences
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(preferencesList) && preferencesList.length > 0 && (
                <div style={{ margin: "50px" }}>
                  <TableTemplate
                    buttonHaver={PreferencesButtonHaver}
                    columns={preferenceColumns}
                    rows={preferenceRows}
                  />
                </div>
              )}

              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
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

export default ShowPreferences;
