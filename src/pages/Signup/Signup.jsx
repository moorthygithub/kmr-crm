import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Checkbox,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "../../Icons/Berry";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setPasswordStrength(
      password.length >= 8
        ? password.match(/[A-Z]/) && password.match(/\d/)
          ? "strong"
          : "medium"
        : "weak"
    );
    formik.handleChange(event);
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
    agree: Yup.boolean().oneOf(
      [true],
      "You must agree to the terms and conditions"
    ),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agree: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
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
        backgroundColor: theme.palette.grey[200],
        width: "100vw",
        px: isSmallScreen ? 1 : 0,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: isSmallScreen ? 2 : 4,
          padding: isSmallScreen ? "16px" : "32px",
          width: isSmallScreen ? "100%" : "400px",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          textAlign: "center",

          margin: isSmallScreen ? "5px" : "50px",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          <Logo />
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
          Sign Up
        </Typography>
        <Typography component="h2" variant="h6" sx={{ color: "grey", mb: 2 }}>
          Enter your credentials to continue
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address/Username"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formik.values.password}
            onChange={handlePasswordChange}
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
          {passwordStrength && (
            <Typography
              variant="body2"
              sx={{
                color: passwordStrength === "strong" ? "green" : "red",
                mb: 2,
              }}
            >
              Password is {passwordStrength}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Checkbox
              id="agree"
              name="agree"
              checked={formik.values.agree}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.agree && Boolean(formik.errors.agree)}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              I agree to the terms and conditions
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign Up
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography
            component={Link}
            to="/login"
            sx={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              color: "primary.main",
              mt: 2,
              textAlign: "center",
            }}
          >
            Already have an account?
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
