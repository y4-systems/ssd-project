import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Paper, Typography, Avatar } from "@mui/material";

const VendorProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container>
      <h1>
        <center>Your Profile</center>
      </h1>

      <ProfileContainer>
        <ProfileHeader elevation={3}>
          <ProfileAvatar>
            <h1>{currentUser ? currentUser.name[0].toUpperCase() : ""}</h1>
          </ProfileAvatar>
          <ProfileName variant="h5">
            {currentUser ? currentUser.name : ""}
          </ProfileName>
          <ProfileText variant="h6">
            Email : {currentUser ? currentUser.email : ""}
          </ProfileText>
          <ProfileText variant="h6">
            Role : {currentUser ? currentUser.role : ""}
          </ProfileText>
          <ProfileText variant="h6">
            Shop Name : {currentUser ? currentUser.shopName : ""}
          </ProfileText>
        </ProfileHeader>
      </ProfileContainer>
    </Container>
  );
};

export default VendorProfile;

const Container = styled.section`
  margin-top: 50px;
  // background: url(https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1);
  // background-size: cover;
  // background-repeat: no-repeat;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  justify-content: center;
  margin-top: 100px;
`;

const ProfileHeader = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 20px;
  background-color: #f0f0f0;
`;

const ProfileAvatar = styled(Avatar)`
  padding: 30px;
  background-color: #3f51b5;
  margin-bottom: 10px;
  align-self: center;
`;

const ProfileName = styled(Typography)`
  padding: 20px;
  text-align: center;
`;

const ProfileText = styled(Typography)`
  margin-bottom: 10px;
`;
