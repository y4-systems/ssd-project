import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPreferenceList } from "../../redux/stableRelated/stableHandle";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import CustomBarChart from "../../components/CustomBarChart";

import { Dialog, DialogTitle } from "@mui/material";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const GuestPreferences = () => {
  const dispatch = useDispatch();
  const { preferencesList, stableDetails } = useSelector(
    (state) => state.stable
  );
  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, "Guest"));
  }, [dispatch, currentUser._id]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [preferenceObliges, setPreferenceObliges] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table");

  useEffect(() => {
    if (userDetails) {
      setPreferenceObliges(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (preferenceObliges === []) {
      dispatch(
        getPreferenceList(currentUser.stableName._id, "TablePreferences")
      );
    }
  }, [preferenceObliges, dispatch, currentUser.stableName._id]);

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => {
    return (
      <>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ marginTop: "20px" }}
        >
          Obligations
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "50px",
          }}
        >
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
        </div>
      </>
    );
  };

  const renderChartSection = () => {
    return (
      <CustomBarChart chartData={preferenceObliges} dataKey="obligesObtained" />
    );
  };

  const renderTableDetailsSection = () => {
    return (
      <Container>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ marginTop: "20px" }}
        >
          Table Details
        </Typography>
        <Typography variant="h5" gutterBottom>
          You are currently in Table {stableDetails && stableDetails.stableName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          And these are the preferences:
        </Typography>
        {preferencesList &&
          preferencesList.map((preference, index) => (
            <div key={index}>
              <Typography variant="subtitle1">
                {preference.subName} ({preference.subCode})
              </Typography>
            </div>
          ))}
      </Container>
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
        <div>
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
            <>{renderTableDetailsSection()}</>
          )}
        </div>
      )}
    </>
  );
};

export default GuestPreferences;
