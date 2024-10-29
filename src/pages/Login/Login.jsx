import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import mainLogo from "../../Icons/Mainlogo.jpg";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StatusContext } from "./StatusCheck";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { statusData } = useContext(StatusContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .min(2, "Password should be of minimum 2 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("status data in login", !statusData);
      if (!statusData) {
        toast.error("Site is under maintenance, please try again later.");
        navigate("/maintenance");
        return;
      }

      try {
        const response = await axios.post(
          "https://kmrlive.in/public/api/panel-login",
          {
            username: values.email,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        console.log("API Response:", data);

        if (response.status === 200 && data.UserInfo && data.UserInfo.token) {
          localStorage.setItem("token", data.UserInfo.token);
          localStorage.setItem("username", data.UserInfo.user.name);

          const storedToken = localStorage.getItem("token");
          console.log("Stored Token:", storedToken);

          if (storedToken === data.UserInfo.token) {
            toast.success("Login Sucessfully.");
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            toast.error("Check the username and password.");
          }
        } else {
          console.error("Error:", data.msg || "No token returned in response.");
          toast.error("Login failed. Username and password are incorrect.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again later.");
      }
    },
  });

  return (
    <Container
      component="main"
      disableGutters
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 0,
        backgroundColor: grey[100],
        width: "100vw",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          width: isSmallScreen ? "100%" : "400px",
          padding: isSmallScreen ? "16px" : "32px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography component="h1" variant="h4">
            <Box
              component="img"
              src={mainLogo}
              alt="Main Logo"
              sx={{ width: "60px", height: "70px" }}
            />
          </Typography>
          <Typography
            component="h1"
            variant={isSmallScreen ? "h5" : "h4"}
            sx={{
              color: "#673ab7",
              mb: 1,
              fontWeight: 600,
              fontFamily: "sans-serif",
            }}
          >
            Hi, Welcome Back
          </Typography>
          <Typography component="h2" variant="h6" sx={{ color: "grey", mb: 2 }}>
            Enter your credentials to continue
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Sign in with Email address
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address/Username"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox {...label} />
              Remember Me
            </Typography>

            <Typography
              component={Link}
              to="/forgot"
              sx={{ cursor: "pointer", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </Button>
          {/* <Typography
            component={Link}
            to="/signup"
            sx={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              color: "primary.main",
              mt: 2,
            }}
          >
            Don't have an account?
          </Typography> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
