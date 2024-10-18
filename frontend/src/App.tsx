// App.js
import React, { ReactElement } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import TaskBoard from "./components/TaskBoard";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";
import ToolbarComponent from "./components/Toolbar";
import { useAuth } from "./contexts/AuthContext";

interface RouteProps {
  element: ReactElement;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<RouteProps> = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicRoute: React.FC<RouteProps> = ({ element, isAuthenticated }) => {
  return !isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ToolbarComponent />
      <Routes>
        <Route key={'/'}
          path="/"
          element={
            <PrivateRoute
              element={<TaskBoard />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route key={'/login'}
          path="/login"
          element={
            <PublicRoute
              element={<Login />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route key={"/signup"}
          path="/signup"
          element={
            <PublicRoute
              element={<SignUp />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route key={"/"}
          path="/profile"
          element={
            <PrivateRoute
              element={<Profile />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
