import React, { useState, useEffect, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

interface NotificationHandlerProps {
  message: string;
  severity: "success" | "error";
  resetMessage: () => void;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  message,
  severity,
  resetMessage,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setSnackbarOpen(true);
    }
  }, [message]);

  const handleClose = useCallback(() => {
    setSnackbarOpen(false);
    resetMessage(); // Clear the message after the snackbar is closed
  }, [resetMessage]);

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationHandler;
