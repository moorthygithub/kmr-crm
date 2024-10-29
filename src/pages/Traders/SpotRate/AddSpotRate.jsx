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

const AddSpotRates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [addspotrate, setAddSpotRate] = useState({
    vendor_id: "",
    vendor_spot_heading: "",
    vendor_spot_details: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setAddSpotRate({
      ...addspotrate,
      [e.target.name]: e.target.value,
    });
  };
  //VENDORS GET
  const [vendorsdata, setVendorsData] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(baseURL + "/panel-fetch-vendor/3", requestOptions)
      .then((response) => response.json())
      .then((data) => setVendorsData(data.vendor));
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vendor_id", addspotrate.vendor_id);
    formData.append("vendor_spot_heading", addspotrate.vendor_spot_heading);
    formData.append("vendor_spot_details", addspotrate.vendor_spot_details);

    const isFormValid = document.getElementById("addNewsForm").checkValidity();
    document.getElementById("addNewsForm").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);

      axios({
        url: `${baseURL}/panel-create-vendor-spot-rates`,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setLoading(true);
          if (res.data.code === 200) {
            toast.success(res.data.msg || "Data inserted successfully", {
              position: "top-right",
            });
            setTimeout(() => {
              navigate("/traders/spotrates");
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
        <Link to="/traders/spotrates">
          <IconButton aria-label="Back">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h6">Create Spot Rate</Typography>
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

        <form id="addNewsForm" autoComplete="off" onSubmit={onSubmit}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "column" }}
            gap={2}
          >
            <Box flex={1}>
              <TextField
                fullWidth
                required
                label="Vendor"
                autoComplete="Name"
                name="vendor_id"
                variant="standard"
                SelectProps={{
                  MenuProps: {},
                }}
                select
                value={addspotrate.vendor_id}
                onChange={onInputChange}
              >
                {vendorsdata.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.vendor_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                required
                label="Heading"
                variant="standard"
                onChange={onInputChange}
                name="vendor_spot_heading"
                value={addspotrate.vendor_spot_heading}
              />
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                required
                label="Spot Details"
                variant="outlined"
                name="vendor_spot_details"
                multiline
                rows={4}
                value={addspotrate.vendor_spot_details}
                onChange={onInputChange}
              />
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <MUIButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isButtonDisabled}
              sx={{ marginRight: 2 }}
            >
              {loading ? "Submitting..." : "Submit"}
            </MUIButton>

            <MUIButton
              component={Link}
              to="/traders/spotrates"
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

export default AddSpotRates;
