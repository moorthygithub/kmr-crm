import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Button, Box, IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileTitle from "../../common/ProfileTitle";
import Grid2 from "@mui/material/Unstable_Grid2";
import { baseURL } from "../../../api/api";

const traderOptions = [
  { value: "1", label: "Live" },
  { value: "2", label: "Rates" },
  { value: "3", label: "Spot Rates" },
];

const Add = () => {
  const navigate = useNavigate();
  const [traderValue, setTraderValue] = useState("");
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
  });
  const [users, setUsers] = useState([
    {
      vendor_product_category_sub: "",
      vendor_product: "",
      vendor_product_size: "",
      vendor_product_rate: "0",
    },
  ]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const addItem = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        vendor_product_category_sub: "",
        vendor_product: "",
        vendor_product_size: "",
        vendor_product_rate: "0",
      },
    ]);
  };

  const removeUser = (index) => {
    setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const handleTraderChange = (e) => {
    setTraderValue(e.target.value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/panel-fetch-category`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategory(response.data.category);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (vendor.vendor_category) {
        try {
          const response = await axios.get(
            `${baseURL}/panel-fetch-sub-category/${vendor.vendor_category}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSubCategory(response.data.categorySub);
        } catch (error) {
          toast.error("Failed to fetch subcategories");
        }
      }
    };

    fetchSubCategories();
  }, [vendor.vendor_category]);

  const resetForm = () => {
    setVendor({
      vendor_name: "",
      vendor_mobile: "",
      vendor_email: "",
      vendor_city: "",
      vendor_address: "",
      vendor_category: "",
    });
    setUsers([
      {
        vendor_product_category_sub: "",
        vendor_product: "",
        vendor_product_size: "",
        vendor_product_rate: "0",
      },
    ]);
    setTraderValue("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...vendor,
      vendor_no_of_products: users.length,
      vendor_trader: traderValue,
      vendorProduct_sub_data: users,
    };

    try {
      const response = await axios.post(
        `${baseURL}/panel-create-vendor`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log(response.data.code, "response");

      if (response.data.code == 200) {
        setLoading(true);
        toast.success(response.data.msg || "Data inserted successfully", {
          position: "top-right",
        });
        resetForm();
        setTimeout(() => {
          navigate("/vendor");
        }, 2000);
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Vendor Duplicate Entry.", {
          position: "top-right",
        });
      } else if (response.data.code == 401) {
        toast.error(response.data.msg || " Email Duplicate Entry.", {
          position: "top-right",
        });
      } else if (response.data.code == 402) {
        toast.error(response.data.msg || " MObile Number Duplicate Entry.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <Box className="textfields-wrapper" sx={{ marginTop: "90px" }}>
      <ToastContainer autoClose={3000} />

      <ProfileTitle title="Create Vendor" backLink="/vendor" />
      <form
        id="addIndiv"
        autoComplete="off"
        onSubmit={onSubmit}
        style={{
          padding: "5%",
          boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px,
          rgba(0, 0, 0, 0.12) 0px -12px 30px,
          rgba(0, 0, 0, 0.12) 0px 4px 6px,
          rgba(0, 0, 0, 0.17) 0px 12px 13px,
          rgba(0, 0, 0, 0.09) 0px -3px 5px`,
        }}
      >
        <Grid2 container spacing={4}>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Vendor"
              name="vendor_name"
              variant="standard"
              value={vendor.vendor_name}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Mobile"
              name="vendor_mobile"
              variant="standard"
              value={vendor.vendor_mobile}
              onChange={handleInputChange}
              inputProps={{ minLength: 10, maxLength: 10 }}
            />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              name="vendor_email"
              variant="standard"
              value={vendor.vendor_email}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 xs={12}>
            <TextField
              fullWidth
              required
              label="Address"
              name="vendor_address"
              variant="standard"
              value={vendor.vendor_address}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="City"
              name="vendor_city"
              value={vendor.vendor_city}
              variant="standard"
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Category"
              name="vendor_category"
              variant="standard"
              select
              value={vendor.vendor_category}
              onChange={handleInputChange}
            >
              {category.map((option) => (
                <MenuItem key={option.id} value={option.category_name}>
                  {option.category_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Trader"
              variant="standard"
              select
              value={traderValue}
              onChange={handleTraderChange}
            >
              {traderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
        </Grid2>
        {users.map((user, index) => (
          <Grid2 container spacing={4} key={index}>
            <Grid2 xs={12} sm={3}>
              <TextField
                fullWidth
                required
                variant="standard"
                label="Sub Category"
                name="vendor_product_category_sub"
                select
                value={user.vendor_product_category_sub}
                onChange={(e) => handleUserChange(e, index)}
              >
                {subcategory.map((option) => (
                  <MenuItem key={option.id} value={option.category_sub_name}>
                    {option.category_sub_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 xs={12} sm={4}>
              <TextField
                fullWidth
                required
                variant="standard"
                label="Product Name"
                name="vendor_product"
                value={user.vendor_product}
                onChange={(e) => handleUserChange(e, index)}
              />
            </Grid2>
            <Grid2 xs={12} sm={2}>
              <TextField
                fullWidth
                required
                label="Size"
                variant="standard"
                name="vendor_product_size"
                value={user.vendor_product_size}
                onChange={(e) => handleUserChange(e, index)}
              />
            </Grid2>
            <Grid2 xs={12} sm={2}>
              <TextField
                fullWidth
                required
                label="Rate"
                variant="standard"
                name="vendor_product_rate"
                type="number"
                inputProps={{ min: 0 }}
                value={user.vendor_product_rate}
                onChange={(e) => handleUserChange(e, index)}
              />
            </Grid2>
            <Grid2 xs={12} sm={1}>
              <IconButton onClick={() => removeUser(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid2>
          </Grid2>
        ))}
        <Grid2 container spacing={2} sx={{ mt: 4 }}>
          <Grid2 xs={12}>
            <Button color="secondary" onClick={addItem} variant="contained">
              Add More
            </Button>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} sm={1} sx={{ textAlign: "center", padding: "25px" }}>
          <Button type="submit" color="primary" variant="contained">
            {loading ? "Submiting..." : "Submit"}
          </Button>
          <Button color="secondary" variant="contained" sx={{ marginLeft: 2 }}>
            Back
          </Button>
        </Grid2>
      </form>
    </Box>
  );
};

export default Add;
