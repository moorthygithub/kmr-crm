import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { baseURL } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios({
      url: `${baseURL}/panel-fetch-profile`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setFirstName(res.data.user.name);
        setPhone(res.data.user.mobile);
        setEmail(res.data.user.email);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const onUpdateProfile = (e) => {
    e.preventDefault();
    if (firstName === "") {
      toast.error("Enter Full Name");
      return;
    }
    if (phone === "" || phone === "NaN") {
      toast.error("Enter Mobile Number");
      return;
    }
    if (phone.length !== 10) {
      toast.error("Mobile Number must be 10 Digits");
      return;
    }
    if (email === "") {
      toast.error("Enter Email Id");
      return;
    }

    let data = {
      first_name: firstName,
      phone,
      email,
    };

    axios({
      url: `${baseURL}/panel-update-profile`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.code === 401) {
          toast.error("Duplicate Entry of Name");
        } else if (res.data.code === 402) {
          toast.error("Duplicate Entry of Mobile");
        } else if (res.data.code === 403) {
          toast.error("Duplicate Entry of Email");
        } else {
          toast.success("Profile Updated Successfully!");
          setTimeout(() => {
            navigate("/dashbord");
          }, 2000);
        }
      })
      .catch(() => {
        toast.error("Profile not Updated");
      });
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Same Old Password is not allowed");
      return;
    }

    let data = {
      old_password: oldPassword,
      password: newPassword,
      username: localStorage.getItem("username"),
    };

    axios({
      url: `${baseURL}/panel-change-password`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Password Updated Successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpenDialog(false);
        setTimeout(() => {
          navigate("/dashbord");
        },2000);
      })
      .catch(() => {
        toast.error("Please enter valid old password");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      });
  };

  const validateOnlyText = (inputtxt) =>
    /^[A-Za-z ]+$/.test(inputtxt) || inputtxt === "";

  const validateOnlyDigits = (inputtxt) =>
    /^\d+$/.test(inputtxt) || inputtxt.length === 0;

  return (
    <Card sx={{ padding: "10px", margin: "20px" }}>
      <Typography sx={{ padding: "10px" }}>Basic Info</Typography>
      <hr />
      <Box>
        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            Admins
          </Typography>
          <Card
            sx={{ padding: "5px", maxWidth: "200px", marginTop: "10px" }}
            onClick={() => setOpenDialog(true)}
          >
            <LockIcon
              sx={{ padding: "0px", margin: "0px", paddingTop: "5px" }}
            />
            <Typography
              sx={{
                display: "inline",
                padding: "0px",
                margin: "0px",
                fontSize: "18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Change password
            </Typography>
          </Card>
        </Box>
      </Box>
      <Box sx={{ marginTop: "40px" }}>
        <form onSubmit={onUpdateProfile}>
          <Box mb={2}>
            <TextField
              label="Full Name"
              fullWidth
              variant="standard"
              required
              value={firstName}
              disabled
              onChange={(e) => {
                if (validateOnlyText(e.target.value)) {
                  setFirstName(e.target.value);
                }
              }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Phone"
              fullWidth
              variant="standard"
              required
              inputProps={{ maxLength: 10, minLength: 10 }}
              value={phone}
              onChange={(e) => {
                if (validateOnlyDigits(e.target.value)) {
                  setPhone(e.target.value);
                }
              }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Email"
              fullWidth
              variant="standard"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className="text-white"
              type="submit"
            >
              Update Profile
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Old Password"
            type="password"
            variant="standard"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            label="New Password"
            type="password"
            variant="standard"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="standard"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onChangePassword}
            variant="contained"
            color="primary"
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Profile;
