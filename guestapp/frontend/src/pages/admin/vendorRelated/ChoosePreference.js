import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Paper,
} from "@mui/material";
import { Dialog, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getVendorFreeTablePreferences } from "../../../redux/stableRelated/stableHandle";
import { updateTeachPreference } from "../../../redux/vendorRelated/vendorHandle";
import { GreenButton, PurpleButton } from "../../../components/buttonStyles";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

const ChoosePreference = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tableID, setTableID] = useState("");
  const [vendorID, setVendorID] = useState("");
  const [loader, setLoader] = useState(false);

  const { preferencesList, loading, error, response } = useSelector(
    (state) => state.stable
  );

  useEffect(() => {
    if (situation === "Norm") {
      setTableID(params.id);
      const tableID = params.id;
      dispatch(getVendorFreeTablePreferences(tableID));
    } else if (situation === "Vendor") {
      const { tableID, vendorID } = params;
      setTableID(tableID);
      setVendorID(vendorID);
      dispatch(getVendorFreeTablePreferences(tableID));
    }
  }, [situation]);

  if (loading) {
    return (
      <div>
        {" "}
        <Dialog open={true}>
          <DialogTitle>Loading</DialogTitle>
        </Dialog>
      </div>
    );
  } else if (response) {
    return (
      <div style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Sorry all preferences have vendors assigned already</h2>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <PurpleButton
              variant="contained"
              onClick={() => navigate("/Admin/addpreference/" + tableID)}
            >
              Add Preferences
            </PurpleButton>
          </div>
        </Box>
      </div>
    );
  } else if (error) {
    console.log(error);
  }

  const updatePreferenceHandler = (vendorId, teachPreference) => {
    setLoader(true);
    dispatch(updateTeachPreference(vendorId, teachPreference));
    navigate("/Admin/vendors");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "30px",
          color: "black",
        }}
      >
        Choose a preference
      </Typography>
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "50px",
          }}
        >
          <TableContainer>
            <Table aria-label="stablees table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">
                    Preference Name
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Preference Category
                  </StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(preferencesList) &&
                  preferencesList.length > 0 &&
                  preferencesList.map((preference, index) => (
                    <StyledTableRow key={preference._id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        style={{ color: "white" }}
                      >
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {preference.subName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {preference.subCode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {situation === "Norm" ? (
                          <GreenButton
                            variant="contained"
                            onClick={() =>
                              navigate(
                                "/Admin/vendors/addvendor/" + preference._id
                              )
                            }
                          >
                            Choose
                          </GreenButton>
                        ) : (
                          <GreenButton
                            variant="contained"
                            disabled={loader}
                            onClick={() =>
                              updatePreferenceHandler(vendorID, preference._id)
                            }
                          >
                            {loader ? (
                              <div tableName="load"></div>
                            ) : (
                              "Choose Sub"
                            )}
                          </GreenButton>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </>
    </Paper>
  );
};

export default ChoosePreference;
