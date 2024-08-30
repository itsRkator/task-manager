import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import apiUserService from "../services/apiUserService";

const Profile = () => {
  const [user, setUser] = useState<{
    avatar: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  }>({
    avatar: "",
    email: "",
    firstName: "",
    id: "",
    lastName: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiUserService.getUserProfile(token ?? "");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await apiUserService.uploadAvatar(token || "", formData);
      setUser((prev) => ({ ...prev, avatar: response.data.avatar }));
    } catch (error) {
      console.error("Failed to upload avatar", error);
    }
  };

  const handleClickUpload = () => {
    const input = document.getElementById("avatar-input") as HTMLInputElement;
    input?.click();
  };

  return (
    <Container maxWidth="md">
      <Box mt={8}>
        <Grid container spacing={4} justifyContent="center">
          <Grid size={4} container justifyContent="center" position="relative">
            <Avatar
              src={user.avatar}
              alt="User Avatar"
              style={{ width: 120, height: 120 }}
            />
            <Box
              position="absolute"
              bottom={40}
              left={105}
              bgcolor="transparent"
              zIndex={10}
              p={1}
              // sx={{
              //   "&:hover": {
              //     bgcolor: "lightgray",
              //     borderRadius: '50%', // Optional: rounded background for better appearance
              //   },
              // }}
            >
              <IconButton color="primary" onClick={handleClickUpload}>
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </Box>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
              onClick={(e) => ((e.target as HTMLInputElement).value = "")} // Reset the input value to allow re-uploading the same file
            />
          </Grid>
          <Grid size={8}>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              User ID: {user.id}
            </Typography>
            <Box mt={2}>
              <Button
                sx={{ textTransform: "none" }}
                onClick={handleAvatarUpload}
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
              >
                Upload Avatar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
