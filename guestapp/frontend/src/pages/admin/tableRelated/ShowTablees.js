import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllStablees } from "../../../redux/stableRelated/stableHandle";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";

import { Dialog, DialogTitle } from "@mui/material";

import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddCardIcon from "@mui/icons-material/AddCard";
import styled from "styled-components";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowTablees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { stableesList, loading, error, getresponse } = useSelector(
    (state) => state.stable
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStablees(adminID, "Stable"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  //Search tables function
  const [searchInput, setSearchInput] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true);
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStablees(adminID, "Stable"));
      setMessage("Deleted Successfully");
    });
  };

  const stableColumns = [{ id: "name", label: "Table Name", minWidth: 170 }];

  const stableRows =
    stableesList &&
    stableesList.length > 0 &&
    stableesList.map((stable) => {
      return {
        name: stable.stableName,
        id: stable._id,
      };
    });

  const filteredStables =
    stableesList &&
    stableesList.length > 0 &&
    stableesList
      .filter((stable) =>
        stable.stableName.toLowerCase().includes(searchInput.toLowerCase())
      )
      .map((stable) => {
        return {
          name: stable.stableName,
          id: stable._id,
        };
      });
  const StableButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PostAddIcon />,
        name: "Add Preferences",
        action: () => navigate("/Admin/addpreference/" + row.id),
      },
      {
        icon: <PersonAddAlt1Icon />,
        name: "Add Guest",
        action: () => navigate("/Admin/table/addguests/" + row.id),
      },
    ];
    return (
      <ButtonContainer>
        <IconButton
          onClick={() => deleteHandler(row.id, "Stable")}
          color="secondary"
        >
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/tablees/table/" + row.id)}
        >
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Add Guests & Preferences">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {actions.map((action) => (
            <MenuItem onClick={action.action}>
              <ListItemIcon fontSize="small">{action.icon}</ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const actions = [
    {
      icon: <AddCardIcon color="primary" />,
      name: "Add New Table",
      action: () => navigate("/Admin/addtable"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Tablees",
      action: () => deleteHandler(adminID, "Stablees"),
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
          {getresponse ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addtable")}
              >
                Add Table
              </GreenButton>
            </Box>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "20vh",
                }}
              >
                <div style={{ position: "relative", width: "20%" }}>
                  <input
                    type="text"
                    placeholder="Search Table"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
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

              {Array.isArray(stableesList) && stableesList.length > 0 && (
                <div style={{ margin: "50px" }}>
                  <TableTemplate
                    buttonHaver={StableButtonHaver}
                    columns={stableColumns}
                    rows={searchInput === "" ? stableRows : filteredStables}
                  />
                </div>
              )}
              <SpeedDialTemplate actions={actions} />
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

export default ShowTablees;

const styles = {
  styledPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
