import axios from "axios";

const USER_API_URL = `${process.env.REACT_APP_API_URL}/users`;

const apiUserService = {
  uploadAvatar: (token: string, formData: any) =>
    axios.post(`${USER_API_URL}/upload-avatar`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getUserProfile: (token: string) =>
    axios.get(`${USER_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default apiUserService;
