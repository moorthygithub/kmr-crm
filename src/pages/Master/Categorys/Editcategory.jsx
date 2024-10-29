import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, MenuItem, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../api/api";
import "react-toastify/dist/ReactToastify.css";
import ProfileTitle from "../../common/ProfileTitle";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const [category, setCategory] = useState({
    category_name: "",
    category_status: "",
    categories_images: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/panel-fetch-category-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategory(response.data.category);
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to fetch category data.");
      }
    };

    fetchCategory();
  }, [id]);

  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_name", category.category_name);
    formData.append("category_status", category.category_status);
    if (selectedFile) {
      formData.append("categories_images", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/panel-update-category/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code === 200) {
        toast.success(response.data.msg || "Data updated successfully", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/register/category");
        }, 2000);
        console.log("Update successful");
      } else {
        toast.error(response.data.msg || "Duplicate Entry", {
          position: "top-right",
        });
        console.log("Update failed: ", response.data.msg);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: "100px" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <ProfileTitle title="Edit Category " backLink="/register/category" />{" "}
      </Box>
      <Box
        sx={{
          padding: "5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",

          boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px,
                rgba(0, 0, 0, 0.12) 0px -12px 30px,
                rgba(0, 0, 0, 0.12) 0px 4px 6px,
                rgba(0, 0, 0, 0.17) 0px 12px 13px,
                rgba(0, 0, 0, 0.09) 0px -3px 5px`,
        }}
      >
        <ToastContainer autoClose={3000} />
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                marginRight: { md: "20px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: { xs: "20px", md: 0 },
              }}
            >
              <img
                src={
                  category.categories_images === null ||
                  category.categories_images === ""
                    ? "https://kmrlive.in/storage/app/public/no_image.jpg"
                    : `https://kmrlive.in/storage/app/public/categories_images/${category.categories_images}`
                }
                alt="Category"
                style={{ width: "215px", height: "215px", objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ flex: 2 }}>
              <TextField
                fullWidth
                required
                label="Category"
                name="category_name"
                value={category.category_name}
                onChange={onInputChange}
                sx={{ marginBottom: "16px" }}
                disabled
                variant="standard"
              />
              <TextField
                fullWidth
                type="file"
                InputLabelProps={{ shrink: true }}
                label="Image"
                name="categories_images"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                sx={{ marginBottom: "16px" }}
                variant="standard"
              />
              <TextField
                fullWidth
                required
                select
                label="Status"
                name="category_status"
                value={category.category_status}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isButtonDisabled || loading}
                sx={{ alignSelf: "flex-start" }}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: "20px" }}
                onClick={() => navigate("/register/category")}
              >
                Back
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Edit;
