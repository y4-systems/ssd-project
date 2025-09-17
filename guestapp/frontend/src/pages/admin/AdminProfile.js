// import React, { useState } from 'react';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
// import { useNavigate } from 'react-router-dom'
// import { authLogout } from '../../redux/userRelated/userSlice';
// import { Button, Collapse } from '@mui/material';
import { useSelector } from "react-redux";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const AdminProfile = () => {
  // const [showTab, setShowTab] = useState(false);
  // const buttonText = showTab ? 'Cancel' : 'Edit profile';

  // const navigate = useNavigate()
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  // const { currentUser, response, error } = useSelector((state) => state.user);
  // const address = "Admin"

  // if (response) { console.log(response) }
  // else if (error) { console.log(error) }

  // const [name, setName] = useState(currentUser.name);
  // const [email, setEmail] = useState(currentUser.email);
  // const [password, setPassword] = useState("");
  // const [eventName, setEventName] = useState(currentUser.eventName);

  // const fields = password === "" ? { name, email, eventName } : { name, email, password, eventName }

  // const submitHandler = (event) => {
  //     event.preventDefault()
  //     dispatch(updateUser(fields, currentUser._id, address))
  // }

  // const deleteHandler = () => {
  //     try {
  //         dispatch(deleteUser(currentUser._id, "Guests"));
  //         dispatch(deleteUser(currentUser._id, address));
  //         dispatch(authLogout());
  //         navigate('/');
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  return (
    <div>
      <Card
        sx={{ maxWidth: 345, margin: "auto", marginTop: "5%" }}
        style={{
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <CardActionArea>
          {/* <CardMedia
            component="img"
            height="100%"
            image="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            alt="user profile"
          /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <center>{currentUser.name}</center>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {currentUser.email}
              <br />
              Event: {currentUser.eventName}
              <br />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {/* <Button variant="contained" color="error" onClick={deleteHandler}>Delete</Button> */}
      {/* <Button variant="contained" sx={styles.showButton}
                onClick={() => setShowTab(!showTab)}>
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
            </Button>
            <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div tableName="register">
                    <form tableName="registerForm" onSubmit={submitHandler}>
                        <span tableName="registerTitle">Edit Details</span>
                        <label>Name</label>
                        <input tableName="registerInput" type="text" placeholder="Enter your name..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name" required />

                        <label>Event</label>
                        <input tableName="registerInput" type="text" placeholder="Enter your event name..."
                            value={eventName}
                            onChange={(event) => setEventName(event.target.value)}
                            autoComplete="name" required />

                        <label>Email</label>
                        <input tableName="registerInput" type="email" placeholder="Enter your email..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email" required />

                        <label>Password</label>
                        <input tableName="registerInput" type="password" placeholder="Enter your password..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password" />

                        <button tableName="registerButton" type="submit" >Update</button>
                    </form>
                </div>
            </Collapse> */}
    </div>
  );
};

export default AdminProfile;

// const styles = {
//     attendanceButton: {
//         backgroundColor: "#270843",
//         "&:hover": {
//             backgroundColor: "#3f1068",
//         }
//     }
// }
