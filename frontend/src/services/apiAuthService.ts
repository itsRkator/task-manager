import axios from "axios";

const AUTH_API_URL = `${process.env.REACT_APP_API_URL}/auth`;

const apiAuthService = {
  login: (email: string, password: string) =>
    axios.post(`${AUTH_API_URL}/login`, { email, password }),
  register: (userData: any) => axios.post(`${AUTH_API_URL}/register`, userData),
};

export default apiAuthService;
