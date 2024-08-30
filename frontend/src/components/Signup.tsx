import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiAuthService from "../services/apiAuthService";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const SignUp: React.FC = () => {
  const { showNotification } = useNotification();
  const [values, setValues] = useState<State>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!values.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!values.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(values.email))
      newErrors.email = "Invalid email format";

    if (!validatePassword(values.password))
      newErrors.password = "Password must be at least 8 characters";
    if (values.password !== values.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await apiAuthService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      showNotification(
        "Registration successful. You can now log in.",
        "success"
      );
      navigate("/login");
    } catch (err) {
      console.error("Sign up failed", err);
      showNotification("Sign up failed. Please try again later.", "error");
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
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, p: 2, border: "2px solid #1976d2", borderRadius: "8px" }}
        >
          <TextField
            variant="outlined"
            fullWidth
            label="First Name"
            value={values.firstName}
            onChange={handleChange("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Last Name"
            value={values.lastName}
            onChange={handleChange("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
          />
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
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-confirm-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={values.showConfirmPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <FormHelperText error>{errors.confirmPassword}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, textTransform: "none" }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }} textAlign="center">
            Already have an account?{" "}
            <Button
              sx={{ textTransform: "none" }}
              color="primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Typography>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Typography textAlign="center">
            <Button
              sx={{ textTransform: "none" }}
              variant="contained"
              color="primary"
              onClick={handleGoogleSignUp}
            >
              Sign up with &nbsp;<b>Google</b>
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
