import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllGuests } from "../../../redux/guestRelated/guestHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { Paper, Box, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  BlackButton,
  BlueButton,
  GreenButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";

import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popup from "../../../components/Popup";

const ShowGuests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { guestsList, loading, error, response } = useSelector(
    (state) => state.guest
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllGuests(currentUser._id));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllGuests(currentUser._id));
      setMessage("Deleted Successfully");
    });
  };

  const guestColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Seat Number", minWidth: 100 },
    { id: "stableName", label: "Table", minWidth: 170 },
  ];

  const guestRows =
    guestsList &&
    guestsList.length > 0 &&
    guestsList.map((guest) => {
      return {
        name: guest.name,
        rollNum: guest.rollNum,
        stableName: guest.stableName.stableName,
        id: guest._id,
      };
    });

  const filterguestRows =
    guestsList &&
    guestsList.length > 0 &&
    guestsList
      .filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((guest) => {
        return {
          name: guest.name,
          rollNum: guest.rollNum,
          stableName: guest.stableName.stableName,
          id: guest._id,
        };
      });
  const GuestButtonHaver = ({ row }) => {
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
      navigate("/Admin/guests/guest/attendance/" + row.id);
    };
    const handleObliges = () => {
      navigate("/Admin/guests/guest/obliges/" + row.id);
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
        <IconButton onClick={() => deleteHandler(row.id, "Guest")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
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

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Guest",
      action: () => navigate("/Admin/addguests"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Guests",
      action: () => deleteHandler(currentUser._id, "Guests"),
    },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Seat Number", "Table"];
    const tableRows = [];

    const guests = searchTerm === "" ? guestRows : filterguestRows;

    guests.forEach((guest) => {
      const guestData = [guest.name, guest.rollNum, guest.stableName];
      tableRows.push(guestData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Guests Report", 14, 15);
    doc.save(`report_${dateStr}.pdf`);
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
                onClick={() => navigate("/Admin/addguests")}
              >
                Add Guests
              </GreenButton>
            </Box>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15vh",
                }}
              >
                <div style={{ position: "relative", width: "20%" }}>
                  <input
                    type="text"
                    placeholder="Search Guest"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: "10px",
                      fontSize: "17px",
                      border: "none",
                      borderBottom: "2px solid blue",
                      borderRadius: "5px",
                      width: "100%",
                      outline: "none",
                      paddingLeft: "40px", // make room for the icon
                    }}
                  />
                  <SearchIcon
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "grey",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  marginRight: "50px",
                  marginBottom: "15px",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={generatePDF}
                >
                  Generate Report
                </Button>
              </div>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                {Array.isArray(guestsList) && guestsList.length > 0 && (
                  <div style={{ margin: "50px" }}>
                    <TableTemplate
                      buttonHaver={GuestButtonHaver}
                      columns={guestColumns}
                      rows={searchTerm === "" ? guestRows : filterguestRows}
                    />
                  </div>
                )}
                <SpeedDialTemplate actions={actions} />
              </Paper>
            </>
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

export default ShowGuests;
