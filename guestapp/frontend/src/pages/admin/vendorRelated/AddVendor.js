import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPreferenceDetails } from "../../../redux/stableRelated/stableHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { CircularProgress } from "@mui/material";

const AddVendor = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const preferenceID = params.id;

  const { status, response, error } = useSelector((state) => state.user);
  const { preferenceDetails } = useSelector((state) => state.stable);

  useEffect(() => {
    dispatch(getPreferenceDetails(preferenceID, "Preference"));
  }, [dispatch, preferenceID]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Vendor";
  const event = preferenceDetails && preferenceDetails.event;
  const teachPreference = preferenceDetails && preferenceDetails._id;
  const teachStable =
    preferenceDetails &&
    preferenceDetails.stableName &&
    preferenceDetails.stableName._id;

  const fields = {
    name,
    email,
    password,
    role,
    event,
    teachPreference,
    teachStable,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate("/Admin/vendors");
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
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          {/* <span className="registerTitle">Assign Servant</span> */}
          <h2 style={{ marginBottom: "10px" }}>
            <center>Assign Vendor</center>
          </h2>

          <br />
          <label>
            Preference : {preferenceDetails && preferenceDetails.subName}
          </label>
          <br />
          <label>
            Table :{" "}
            {preferenceDetails &&
              preferenceDetails.stableName &&
              preferenceDetails.stableName.stableName}
          </label>
          <br />
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter vendor's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          <label>Email</label>
          <input
            className="registerInput"
            type="email"
            placeholder="Enter vendor's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label>ID Number</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter vendor's ID number..."
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
            {loader ? <CircularProgress size={24} color="inherit" /> : "Assign"}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default AddVendor;
