import React from "react";
import styled from "styled-components";
import { Card, CardContent, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const VendorProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const teachStable = currentUser.teachStable;
  const teachPreference = currentUser.teachPreference;
  const teachEvent = currentUser.event;

  return (
    <>
      <div style={{ marginTop: "80px" }}>
        <center>
          <ProfileCard>
            <ProfileCardContent>
              <center>
                <h3> {currentUser.name}</h3>
              </center>
              <br />
              <ProfileText>Email: {currentUser.email}</ProfileText>
              <ProfileText>Table: {teachStable.stableName}</ProfileText>
              <ProfileText>Preference: {teachPreference.subName}</ProfileText>
              <ProfileText>Event: {teachEvent.eventName}</ProfileText>
            </ProfileCardContent>
          </ProfileCard>
        </center>
      </div>
    </>
  );
};

export default VendorProfile;

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
  text-align: left;
`;
