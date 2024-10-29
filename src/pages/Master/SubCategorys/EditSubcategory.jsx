import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, MenuItem } from "@mui/material";
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

  const [subcategory, setSubCategory] = useState({
    category_id: "",
    category_sub_name: "",
    category_sub_status: "",
    categories_sub_images: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorydata, setcategorydata] = useState([]);

  // Fetch individual subcategory data for editing
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/panel-fetch-sub-category-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubCategory(response.data.categorySub);
        console.log(response.data.categorySub);
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to fetch category data.");
      }
    };

    fetchCategory();
  }, [id]);

  // Handle input changes
  const onInputChange = (e) => {
    setSubCategory({
      ...subcategory,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${baseURL}/panel-fetch-category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data, "data for drop down");
        setcategorydata(response.data.category);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", subcategory.category_id);
    formData.append("category_sub_name", subcategory.category_sub_name);
    formData.append("category_sub_status", subcategory.category_sub_status);
    if (selectedFile) {
      formData.append("categories_images", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/panel-update-sub-category/${id}?_method=PUT`,
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
          navigate("/subcategory");
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
        <ProfileTitle title="Edit Category" backLink="/subcategory" />
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
                  subcategory?.categories_sub_images === null ||
                  subcategory?.categories_sub_images === ""
                    ? "https://kmrlive.in/storage/app/public/no_image.jpg"
                    : `https://kmrlive.in/storage/app/public/sub_categories_images/${subcategory.categories_sub_images}`
                }
                alt="Sub Category"
                style={{ width: "215px", height: "215px", objectFit: "cover" }}
              />
            </Box>

            <Box sx={{ flex: 2 }}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="category_id"
                value={subcategory.category_id}
                onChange={onInputChange}
                sx={{ marginBottom: "16px" }}
                variant="standard"
              >
                {categorydata.map((option) => (
                  <MenuItem key={option.category_name} value={option.id}>
                    {option.category_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                required
                disabled
                label="Sub Category"
                autoComplete="Name"
                name="category_sub_name"
                variant="standard"
                value={subcategory.category_sub_name}
                onChange={onInputChange}
              />
              <TextField
                fullWidth
                type="file"
                InputLabelProps={{ shrink: true }}
                label="Image"
                name="categories_images"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                sx={{ marginBottom: "16px", marginTop: "16px" }}
                variant="standard"
              />

              <TextField
                select
                label="Status"
                fullWidth
                name="category_sub_status"
                value={subcategory.category_sub_status}
                onChange={onInputChange}
                variant="standard"
                sx={{ marginBottom: "16px", marginTop: "16px" }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isButtonDisabled}
                sx={{ alignSelf: "flex-start" }}
              >
                {loading ? "Updating..." : "Update"}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: "20px" }}
                onClick={() => {
                  navigate("/subcategory");
                }}
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
