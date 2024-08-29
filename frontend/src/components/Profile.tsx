import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Avatar } from '@mui/material';
import apiUserService from '../services/apiUserService';


const Profile = () => {
  const [user, setUser] = useState<any>({});
  const [avatar, setAvatar] = useState<File | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiUserService.getUserProfile(token || '');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const response = await apiUserService.uploadAvatar(token || '', formData);
      setUser((prev: any) => ({ ...prev, avatar: response.data.avatar }));
    } catch (error) {
      console.error('Failed to upload avatar', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          User Profile
        </Typography>
        <Avatar src={`/${user.avatar}`} alt="User Avatar" style={{ width: 100, height: 100, margin: 'auto' }} />
        <Box mt={2} textAlign="center">
          <input type="file" onChange={handleAvatarChange} />
          <Button onClick={handleAvatarUpload} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Upload Avatar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
