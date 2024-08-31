// utils/authUtils.js

interface HandleAuthErrorDto {
  err: any;
  showNotification: (message: string, severity: "error" | "success") => void;
  errorMessage: string;
}
// Utility function for handling authentication errors
export const handleAuthError = (authErrorDto: HandleAuthErrorDto) => {
  const { err, showNotification, errorMessage } = authErrorDto;
  console.log(err);
  if (
    err.response?.status === 401 &&
    [
      "Authorization header missing",
      "Invalid token type",
      "Token missing",
      "Invalid token",
    ].includes(err.response?.data?.message ?? "")
  ) {
    // Clear the token if it's an authentication error
    localStorage.removeItem("token"); // Adjust according to where the token is stored
    showNotification(
      "Your session has expired. Please log in again.",
      "success"
    ); // Notify the user
  } else {
    showNotification(errorMessage, "error"); // Handle other errors
  }
};
