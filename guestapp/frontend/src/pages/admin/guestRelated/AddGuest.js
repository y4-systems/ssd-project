import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllStablees } from "../../../redux/stableRelated/stableHandle";
import { CircularProgress } from "@mui/material";
// import "../../../styles/adminstyles.css";
// import "../../../index.css";

const AddGuest = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { stableesList } = useSelector((state) => state.stable);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [tableName, setTableName] = useState("");
  const [stableName, setStableName] = useState("");

  const adminID = currentUser._id;
  const role = "Guest";
  const attendance = [];

  useEffect(() => {
    if (situation === "Table") {
      setStableName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllStablees(adminID, "Stable"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Table") {
      setTableName("Select Table");
      setStableName("");
    } else {
      const selectedTable = stableesList.find(
        (tableItem) => tableItem.stableName === event.target.value
      );
      setTableName(selectedTable.stableName);
      setStableName(selectedTable._id);
    }
  };

  const fields = {
    name,
    rollNum,
    password,
    stableName,
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (stableName === "") {
      setMessage("Please select a tablename");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
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
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          {/* <span className="registerTitle">Add Guest</span> */}
          <h2>
            <center>Add Guest</center>
          </h2>

          <br />
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter guest's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          {situation === "Guest" && (
            <>
              <label>Table</label>
              <select
                className="registerInput"
                value={tableName}
                onChange={changeHandler}
                required
              >
                <option value="Select Table">Select Table</option>
                {stableesList.map((tableItem, index) => (
                  <option key={index} value={tableItem.stableName}>
                    {tableItem.stableName}
                  </option>
                ))}
              </select>
            </>
          )}
          <br />
          <label>Seat Number</label>
          <input
            className="registerInput"
            type="number"
            placeholder="Enter guest's Seat Number..."
            value={rollNum}
            onChange={(event) => setRollNum(event.target.value)}
            required
          />
          <br />
          <label>ID Number</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter guest's ID Number"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button
            className="registerButton"
            type="submit"
            disabled={loader}
            style={{ backgroundColor: "#4d1c9c" }}
          >
            {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddGuest;
