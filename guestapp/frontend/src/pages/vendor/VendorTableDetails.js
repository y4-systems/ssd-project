import { useEffect } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTableGuests } from "../../redux/stableRelated/stableHandle";
import {
  Paper,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const VendorTableDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stableGuests, loading, error, getresponse } = useSelector(
    (state) => state.stable
  );

  const { currentUser } = useSelector((state) => state.user);
  const tableID = currentUser.teachStable?._id;
  const preferenceID = currentUser.teachPreference?._id;

  useEffect(() => {
    dispatch(getTableGuests(tableID));
  }, [dispatch, tableID]);

  if (error) {
    console.log(error);
  }

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
    const options = ["Take Attendance", "Oblige"];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleObliges();
      }
    };

    const handleAttendance = () => {
      navigate(`/Vendor/table/guest/attendance/${row.id}/${preferenceID}`);
    };
    const handleObliges = () => {
      navigate(`/Vendor/table/guest/obliges/${row.id}/${preferenceID}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Vendor/table/guest/" + row.id)}
        >
          View
        </BlueButton>
        <React.Fragment>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <BlackButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
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
          {/* <Typography variant="h4" align="center" gutterBottom>
            Table Details
          </Typography> */}
          {getresponse ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-center",
                  marginTop: "16px",
                }}
              >
                <Dialog open={true}>
                  <DialogTitle>No Guests Found</DialogTitle>
                </Dialog>
              </Box>
            </>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Typography variant="h5" gutterBottom sx={{ marginTop: "10px" }}>
                <center>Guests List</center>
              </Typography>

              {Array.isArray(stableGuests) && stableGuests.length > 0 && (
                <div style={{ margin: "50px" }}>
                  <TableTemplate
                    buttonHaver={GuestsButtonHaver}
                    columns={guestColumns}
                    rows={guestRows}
                  />
                </div>
              )}
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default VendorTableDetails;
