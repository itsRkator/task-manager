import React, { useState, useEffect, ChangeEvent } from "react";
import { Container, Typography, Box, Avatar, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import apiUserService from "../services/apiUserService";
import { useNotification } from "../contexts/NotificationContext";
import { handleAuthError } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessageUtils";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const Profile = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
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
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await apiUserService.getUserProfile(token ?? "");
        if (isMounted) {
          setUser(response.data.user);
          showNotification("Successfully fetch user profile.", "success");
        }
      } catch (error: any) {
        console.error("Failed to fetch user profile", error);
        handleAuthError({
          error,
          showNotification,
          errorMessage: `Failed to fetch user profile. Please try again. Error: ${getErrorMessage(
            error
          )}`,
          navigate,
        });
      }
    };

    if (token) fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [token, navigate, showNotification]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e?.target?.files || e.target.files.length === 0) {
        throw new Error("No file selected");
      }

      const file = e.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File is too large. Maximum size is 2MB.");
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG and PNG are allowed.");
      }

      setAvatar(file);
      console.log("File selected:", file.name);

      handleAvatarUpload();
    } catch (error: any) {
      console.error("Error handling file change:", error.message);
      handleAuthError({
        error,
        showNotification,
        errorMessage: `An error occurred while saving the task. Please try again. Error: ${getErrorMessage(
          error
        )}`,
        navigate,
      });
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await apiUserService.uploadAvatar(token ?? "", formData);

      // Update user state with the new avatar URL/path
      setUser((prev) => ({ ...prev, avatar: response.data.avatar }));

      // Optionally show a success notification
      showNotification &&
        showNotification("Avatar updated successfully!", "success");
    } catch (error: any) {
      console.error("Failed to upload avatar", error);

      // Handle error and show notification with the original dynamic errorMessage
      handleAuthError({
        error,
        showNotification,
        errorMessage: `Failed to upload avatar: ${
          error?.response?.data?.error ||
          error?.response?.data?.error?.[0]?.msg ||
          error.message ||
          "Unknown error occurred"
        }`,
        navigate,
      });
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
              bottom={-15}
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
            {/* <Box mt={2}>
              <Button
                sx={{ textTransform: "none" }}
                onClick={handleAvatarUpload}
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
              >
                Upload Avatar
              </Button>
            </Box> */}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
