import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Box,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL } from "../../../api/api";
import axios from "axios";
import PageTitleBar from "../../common/ProfileTitle";

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

const SubCategory = ({ match }) => {
  const [loader, setLoader] = useState(true);
  const [categoryData, setCategoryData] = useState([]);

  const getData = () => {
    axios
      .get(`${baseURL}/panel-fetch-sub-category-list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const response = res.data.categorySub;
        const tempRows = response.map((item, index) => [
          index + 1,
          <img
            src={
              item.categories_sub_images
                ? `https://kmrlive.in/storage/app/public/sub_categories_images/${item.categories_sub_images}`
                : "https://kmrlive.in/storage/app/public/no_image.jpg"
            }
            alt="Sub Category"
            style={{ width: "40px", height: "40px" }}
          />,
          item.category_name,
          item.category_sub_name,
          item.category_sub_status,
          item.id,
        ]);
        setCategoryData(tempRows);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box className="data-table-wrapper" sx={{ p: 2, marginTop: "80px" }}>
      {loader ? (
        <CircularProgress
          disableShrink
          sx={{
            margin: "300px auto",
            display: "block",
          }}
          color="secondary"
        />
      ) : (
        <>
          <PageTitleBar
            title="Sub Category List"
            backLink="-1"
            buttonLabel="+ Add Sub Category"
            buttonLink="/subcategory/add"
          />
          <MUIDataTable
            title={"Sub Category List"}
            data={categoryData}
            columns={[
              {
                name: "#",
                options: { filter: false, print: false, download: false },
              },
              {
                name: "Images",
                options: { filter: false, print: false, download: false },
              },
              "Category",
              "Sub Category",
              "Status",
              {
                name: "Actions",
                options: {
                  filter: false,
                  print: false,
                  download: false,
                  customBodyRender: (value) => (
                    <Tooltip title="Edit" placement="top">
                      <IconButton>
                        <Link to={"edit?id=" + value}>
                          <EditIcon />
                        </Link>
                      </IconButton>
                    </Tooltip>
                  ),
                },
              },
            ]}
            options={options}
          />
        </>
      )}
    </Box>
  );
};

export default SubCategory;
