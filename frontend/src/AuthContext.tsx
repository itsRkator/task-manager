import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiAuthService from "./services/apiAuthService";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Check if the URL contains a token (after Google login redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      navigate("/"); // Redirect to the home page or a protected route
    }
  }, [location, navigate]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await apiAuthService.login(email, password);
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigate("/");
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    [navigate]
  );

  const googleLogin = useCallback(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, googleLogin, setIsAuthenticated }),
    [isAuthenticated, login, logout, googleLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
