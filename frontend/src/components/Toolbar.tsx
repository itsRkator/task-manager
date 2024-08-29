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
import { useAuth } from "../AuthContext";

const ToolbarComponent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            size="small"
            edge="start"
            color="primary"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <AssignmentIcon style={{ color: "#ebf0f5" }} />
          </Typography>
          {!isAuthenticated ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: !isLoginPage ? "#ebf0f5" : "#1976d2",
                  background: !isLoginPage ? "transparent" : "#ebf0f5",
                  marginRight: 1,
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                sx={{
                  color: isLoginPage ? "#ebf0f5" : "#1976d2",
                  background: isLoginPage ? "transparent" : "#ebf0f5",
                  marginLeft: 1,
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button variant="contained" color="warning" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ToolbarComponent;
