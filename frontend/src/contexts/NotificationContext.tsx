import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Snackbar, Alert } from "@mui/material";

interface NotificationContextProps {
  showNotification: (message: string, severity: "success" | "error") => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  }>({
    message: "",
    severity: "success",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showNotification = useCallback(
    (message: string, severity: "success" | "error") => {
      setNotification({ message, severity });
      setSnackbarOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      showNotification,
    }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
