import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const Login: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let emailError = "";
    let passwordError = "";
    if (!values.email) {
      emailError = "Email is required";
    } else if (!validateEmail(values.email)) {
      emailError = "Invalid email format";
    }

    if (!values.password) {
      passwordError = "Password is required";
    } else if (!validatePassword(values.password)) {
      passwordError =
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character";
    }

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ password: "", email: "" });

    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          alignSelf="left"
          color="primary"
          component="h1"
          variant="h4"
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, p: 2, border: "2px solid #1976d2", borderRadius: "8px" }}
        >
          <TextField
            variant="outlined"
            fullWidth
            label="Email"
            value={values.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              error={!!errors.password}
            />
            {errors.password && (
              <FormHelperText error>{errors.password}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }} textAlign="center">
            Don't have an account?{" "}
            <Button color="primary" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Typography textAlign="center">
            <Button variant="contained" color="primary" onClick={googleLogin}>
              Login with &nbsp;<b>Google</b>
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
