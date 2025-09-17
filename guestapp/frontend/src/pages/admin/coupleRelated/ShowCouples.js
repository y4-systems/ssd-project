import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCouples } from "../../../redux/coupleRelated/coupleHandle";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowCouples = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { couplesList, loading, error, response } = useSelector(
    (state) => state.couple
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllCouples(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

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
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}
      >
        <GreenButton
          variant="contained"
          onClick={() => navigate("/Admin/couples/choosetable")}
        >
          Add Couple
        </GreenButton>
      </Box>
    );
  } else if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllCouples(currentUser._id));
      setMessage("Deleted Successfully");
    });
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "teachPreference", label: "Preference", minWidth: 100 },
    { id: "teachStable", label: "Table", minWidth: 170 },
  ];

  const rows = couplesList.map((couple) => {
    return {
      name: couple.name,
      teachPreference: couple.teachPreference?.subName || null,
      teachStable: couple.teachStable.stableName,
      teachStableID: couple.teachStable._id,
      id: couple._id,
    };
  });

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Couple",
      action: () => navigate("/Admin/couples/choosetable"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Couples",
      action: () => deleteHandler(currentUser._id, "Couples"),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === "teachPreference") {
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {value ? (
                              value
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => {
                                  navigate(
                                    `/Admin/couples/choosepreference/${row.teachStableID}/${row.id}`
                                  );
                                }}
                              >
                                Add Preference
                              </Button>
                            )}
                          </StyledTableCell>
                        );
                      }
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={() => deleteHandler(row.id, "Couple")}
                      >
                        <PersonRemoveIcon color="error" />
                      </IconButton>
                      <BlueButton
                        variant="contained"
                        onClick={() =>
                          navigate("/Admin/couples/couple/" + row.id)
                        }
                      >
                        View
                      </BlueButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 5));
          setPage(0);
        }}
      />

      <SpeedDialTemplate actions={actions} />
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Paper>
  );
};

export default ShowCouples;
