import React, { useState, useEffect } from "react";
import {
  TextField,
  Button as MUIButton,
  Box,
  IconButton,
  Typography,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseURL } from "../../../api/api";
import { ArrowBack } from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2";

const statusOptions = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const AddVendorUser = () => {
  const navigate = useNavigate();

  const [VendorUser, setVendorUser] = useState({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setVendorUser({
      ...VendorUser,
      [name]: value,
    });
  };

  var url = new URL(window.location.href);
  var id = url.searchParams.get("id");

  useEffect(() => {
    axios({
      url: baseURL + "/panel-fetch-vendor-user-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setVendorUser(res.data.adminUser);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", VendorUser.name);
    data.append("mobile", VendorUser.mobile);
    data.append("email", VendorUser.email);
    data.append("remarks", VendorUser.remarks);
    data.append("status", VendorUser.status);

    //GET

    const isFormValid = document.getElementById("addIndiv").checkValidity();
    document.getElementById("addIndiv").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);

      var url = new URL(window.location.href);
      var id = url.searchParams.get("id");
      axios({
        url: baseURL + "/panel-update-vendor-user/" + id + "?_method=PUT",
        method: "POST",
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            setLoading(true);
            toast.success(res.data.msg || "Data inserted successfully", {
              position: "top-right",
            });
            setTimeout(() => {
              navigate("/vendoruser");
            }, 2000);
          } else {
            toast.error(res.data.msg || "Duplicate Entry", {
              position: "top-right",
            });
            setIsButtonDisabled(false);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.msg || "An error occurred", {
            position: "top-right",
          });
          setIsButtonDisabled(false);
          setLoading(false);
        });
    }
  };

  return (
    <Box sx={{ marginTop: "100px" }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Link to="/vendoruser">
          <IconButton aria-label="Back">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h6" sx={{ marginLeft: "8px" }}>
          Create Vendor User
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "5%",
          boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px,
              rgba(0, 0, 0, 0.12) 0px -12px 30px,
              rgba(0, 0, 0, 0.12) 0px 4px 6px,
              rgba(0, 0, 0, 0.17) 0px 12px 13px,
              rgba(0, 0, 0, 0.09) 0px -3px 5px`,
        }}
      >
        <ToastContainer autoClose={3000} />

        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <Grid2 container spacing={4}>
            <Grid2 xs={12} md={4}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  name="name"
                  variant="standard"
                  value={VendorUser.name}
                  disabled
                  onChange={onInputChange}
                />
              </Box>
            </Grid2>

            <Grid2 xs={12} md={4}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Mobile"
                  name="mobile"
                  variant="standard"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  value={VendorUser.mobile}
                  onChange={onInputChange}
                />
              </Box>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  name="email"
                  variant="standard"
                  value={VendorUser.email}
                  onChange={onInputChange}
                />
              </Box>
            </Grid2>
            <Grid2 xs={8}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Remarks"
                  name="remarks"
                  variant="standard"
                  value={VendorUser.remarks}
                  onChange={onInputChange}
                />
              </Box>
            </Grid2>
            <Grid2 xs={4}>
              <Box>
                <TextField
                  fullWidth
                  required
                  select
                  label="Status"
                  name="status"
                  value={VendorUser.status}
                  onChange={onInputChange}
                  sx={{ marginBottom: "16px" }}
                  variant="standard"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid2>
          </Grid2>
          <Box display="flex" justifyContent="center" mt={2}>
            <MUIButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isButtonDisabled}
              sx={{ marginRight: 2 }}
            >
              {loading ? "Updating..." : "Update"}
            </MUIButton>

            <MUIButton
              component={Link}
              to="/vendoruser"
              variant="contained"
              color="secondary"
            >
              Back
            </MUIButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddVendorUser;
