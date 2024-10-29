import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Box,
  AppBar,
  Toolbar,
  FormGroup,
  TextField,
  CssBaseline,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../api/api";
import mainLogo from "../../Icons/Mainlogo.jpg";

const Forgotpwd = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = () => {
    // const formData = new FormData();
    // formData.append("username", username);
    // formData.append("email", email);

    const data = {
      username: username,
      email: email,
    };
    console.log("debug", data);
    if (email !== "" && username !== "") {
      axios({
        url: `${baseURL}/panel-send-password?username=${username}&email=${email}`,
        method: "POST",
        data: data,
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("New Password Sent to your Email");
            setTimeout(() => {
              navigate("/signin");
            }, 3000);
          } else {
            toast.error("This email is not Register with us ");
          }
        })
        .catch((error) => {
          toast.error("Email Not sent.");
        });
    } else {
      toast.warn("Please enter a User Name & Email");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img src={mainLogo} alt="Main Logo" width="60" height="70" />
        </Box>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
          Reset Password
        </Typography>
        <FormGroup sx={{ width: "100%", mt: 2 }}>
          <TextField
            type="text"
            name="username"
            fullWidth
            label="Enter User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            type="email"
            name="email"
            fullWidth
            label="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onResetPassword}
            sx={{ mb: 2 }}
          >
            Reset Password
          </Button>
        </FormGroup>
        <Button
          component={Link}
          to="/signin"
          fullWidth
          variant="outlined"
          color="secondary"
        >
          Already have an account? Login
        </Button>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default Forgotpwd;
