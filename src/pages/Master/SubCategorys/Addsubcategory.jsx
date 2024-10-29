import React, { useState, useEffect } from "react";
import {
  TextField,
  Button as MUIButton,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseURL } from "../../../api/api";
import { ArrowBack } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";

const AddsubCategory = () => {
  const navigate = useNavigate();
  const [categorydata, setcategorydata] = useState([]);

  const [category, setCategory] = useState({
    category_id: "",
    subcategory_name: "",
    categories_images: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", category.category_id);
    formData.append("category_sub_name", category.subcategory_name);

    if (selectedFile) {
      formData.append("categories_sub_images", selectedFile);
    }

    const isFormValid = document.getElementById("addIndiv").checkValidity();
    document.getElementById("addIndiv").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);

      axios({
        url: `${baseURL}/panel-create-sub-category`,
        method: "POST",
        data: formData,
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
              navigate("/subcategory");
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

  // Fetch categories GET
  useEffect(() => {
    const theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${theLoginToken}`,
      },
    };

    fetch(baseURL + "/panel-fetch-category", requestOptions)
      .then((response) => response.json())
      .then((data) => setcategorydata(data.category || []));
  }, []);

  return (
    <Box sx={{ marginTop: "100px" }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Link to="/subcategory">
          <IconButton aria-label="Back">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h6" sx={{ marginLeft: "8px" }}>
          Create SubCategory 
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
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <Box flex={1}>
              <TextField
                fullWidth
                required
                label="Category"
                autoComplete="off"
                select
                name="category_id"
                variant="standard"
                value={category.category_id || ""}
                onChange={onInputChange}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categorydata.length > 0
                  ? categorydata.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.category_name}
                      </MenuItem>
                    ))
                  : null}
              </TextField>
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                required
                label="Sub Category"
                name="subcategory_name"
                variant="standard"
                value={category.subcategory_name}
                onChange={onInputChange}
              />
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                required
                type="file"
                InputLabelProps={{ shrink: true }}
                label="Image"
                variant="standard"
                onChange={(e) => setSelectedFile(e.target.files[0])}
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
              {loading ? "Submiting..." : "Submit"}
            </MUIButton>

            <MUIButton
              component={Link}
              to="/subcategory"
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

export default AddsubCategory;
