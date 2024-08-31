// utils/authUtils.js

import { NavigateFunction } from "react-router-dom";

interface HandleAuthErrorDto {
  error: any;
  errorMessage: string;
  showNotification: (message: string, severity: "error" | "success") => void;
  navigate: NavigateFunction;
}
// Utility function for handling authentication errors
export const handleAuthError = (authErrorDto: HandleAuthErrorDto) => {
  const { error, showNotification, errorMessage, navigate } = authErrorDto;

  if (
    error.response?.status === 401 &&
    [
      "Authorization header missing",
      "Invalid token type",
      "Token missing",
      "Invalid token",
    ].includes(error.response?.data?.message ?? "")
  ) {
    // Clear the token if it's an authentication error
    localStorage.removeItem("token"); // Adjust according to where the token is stored
    showNotification(
      "Your session has expired. Please log in again.",
      "success"
    ); // Notify the user
    navigate("/");
  } else {
    showNotification(errorMessage, "error"); // Handle other errors
  }
};
