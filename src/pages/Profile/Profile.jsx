import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Layout from "../../components/Layout";
import { Lock } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MUIButton,
  TextField as MUITextField,
} from "@mui/material";
import { Base_Url } from "../../config/BaseUrl";

// Reusable Input Component
const InputField = ({ label, value, onChange, type = "text", placeholder, required, disabled, validate }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => {
        if (!validate || validate(e.target.value)) {
          onChange(e.target.value);
        }
      }}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  </div>
);

// Reusable Dialog Component
const ChangePasswordDialog = ({ open, onClose, onChangePassword, oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Change Password</DialogTitle>
    <DialogContent>
      <form onSubmit={onChangePassword} className="space-y-4">
        <MUITextField
          label="Old Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
          required
        />
        <MUITextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          required
        />
        <MUITextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
        />
      </form>
    </DialogContent>
    <DialogActions>
      <MUIButton onClick={onClose} color="secondary">
        Cancel
      </MUIButton>
      <MUIButton onClick={onChangePassword} color="primary">
        Change Password
      </MUIButton>
    </DialogActions>
  </Dialog>
);

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${Base_Url}/panel-fetch-profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFirstName(response.data.user.name);
        setPhone(response.data.user.mobile);
        setEmail(response.data.user.email);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const onUpdateProfile = async (e) => {
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

    const data = {
      first_name: firstName,
      phone,
      email,
    };

    try {
      const response = await axios.post(`${Base_Url}/panel-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code === 401) {
        toast.error("Duplicate Entry of Name");
      } else if (response.data.code === 402) {
        toast.error("Duplicate Entry of Mobile");
      } else if (response.data.code === 403) {
        toast.error("Duplicate Entry of Email");
      } else {
        toast.success("Profile Updated Successfully!");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Profile not Updated");
    }
  };

  // Handle password change
  const onChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Same Old Password is not allowed");
      return;
    }

    const data = {
      old_password: oldPassword,
      password: newPassword,
      username: localStorage.getItem("username"),
    };

    try {
      const response = await axios.post(`${Base_Url}/panel-change-password`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code === 200) {
        toast.success("Password Updated Successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpenDialog(false);
        navigate("/home");
      }
    } catch (error) {
      toast.error("Please enter valid old password");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Validation functions
  const validateOnlyText = (inputtxt) => /^[A-Za-z ]+$/.test(inputtxt) || inputtxt === "";
  const validateOnlyDigits = (inputtxt) => /^\d+$/.test(inputtxt) || inputtxt.length === 0;

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Basic Info</h2>
            <hr className="mb-4" />
          </div>

          <form onSubmit={onUpdateProfile} className="space-y-4">
            <InputField
              label="Full Name"
              value={firstName}
              onChange={setFirstName}
              placeholder="Enter Full Name"
              required
              disabled
              validate={validateOnlyText}
            />
            <InputField
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="Enter Phone"
              required
              validate={validateOnlyDigits}
            />
            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="Enter Email"
              required
            />

            {/* Update Profile Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Change Password</h2>
            <button
              onClick={() => setOpenDialog(true)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Change Password</span>
            </button>
          </div>
        </div>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onChangePassword={onChangePassword}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      </div>
    </Layout>
  );
};

export default Profile;