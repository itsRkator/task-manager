import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ToolbarComponent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="info">
        <Toolbar variant="dense" color="info">
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            sx={{
              color: "#fff",
              marginRight: 1,
              textTransform: "none",
            }}
          >
            <AssignmentIcon sx={{ color: "#ebf0f5" }} /> &nbsp;Task Manager
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          {!isAuthenticated ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="outlined" // Ensure consistent button variant
                sx={{
                  color: !isLoginPage ? "#ebf0f5" : "#1976d2",
                  backgroundColor: !isLoginPage ? "transparent" : "#ebf0f5",
                  marginRight: 1,
                  textTransform: "none",
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outlined" // Ensure consistent button variant
                sx={{
                  color: isLoginPage ? "#ebf0f5" : "#1976d2",
                  backgroundColor: isLoginPage ? "transparent" : "#ebf0f5",
                  marginLeft: 1,
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/profile")}
                variant="outlined"
                sx={{
                  color: "#fff",
                  marginRight: 1,
                  textTransform: "none",
                }}
              >
                Profile
              </Button>
              <Button
                onClick={logout}
                variant="contained"
                color="warning"
                sx={{
                  textTransform: "none",
                  marginLeft: 1,
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ToolbarComponent;
