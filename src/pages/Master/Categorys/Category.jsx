import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL } from "../../../api/api";
import axios from "axios";
import ProfileTitle from "../../common/ProfileTitle";

const NewListCategory = () => {
  const [loader, setLoader] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  const columnData = [
    {
      name: "#",
      options: {
        filter: false,
        print: false,
        download: false,
      },
    },
    {
      name: "Images",
      options: {
        filter: false,
        print: false,
        download: false,
        customBodyRender: (imageUrl) => (
          <img
            src={
              imageUrl
                ? `https://kmrlive.in/storage/app/public/categories_images/${imageUrl}`
                : "https://kmrlive.in/storage/app/public/no_image.jpg"
            }
            alt="Category"
            style={{ width: "40px", height: "40px" }}
          />
        ),
      },
    },
    "Category",
    "Status",
    {
      name: "Actions",
      options: {
        filter: false,
        print: false,
        download: false,
        customBodyRender: (id) => (
          <Tooltip title="Edit" placement="top">
            <IconButton
              aria-label="Edit"
              onClick={() => navigate(`/category/edit?id=${id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    },
  ];

  const options = {
    print: false,
    download: false,
    filterType: "dropdown",
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              width: "100%",
               marginTop: "20px",
            }}
          >
            Sorry, no data available
          </Typography>
        ),
      },
    },
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/panel-fetch-category-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tempRows = response.data.category.map((item, index) => [
        index + 1,
        item.categories_images,
        item.category_name,
        item.category_status,
        item.id,
      ]);
      setCategoryData(tempRows);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="data-table-wrapper" style={{ marginTop: "100px" }}>
      {loader ? (
        <CircularProgress
          disableShrink
          style={{
            marginLeft: "600px",
            marginTop: "300px",
            marginBottom: "300px",
          }}
          color="secondary"
        />
      ) : (
        <>
          <ProfileTitle
            title="Category List"
            backLink="-1"
            buttonLabel="+ Add Category"
            buttonLink="/register/category/add"
          />

          <MUIDataTable
            title={"Category List"}
            data={categoryData}
            columns={columnData}
            options={options}
          />
        </>
      )}
    </div>
  );
};

export default NewListCategory;
