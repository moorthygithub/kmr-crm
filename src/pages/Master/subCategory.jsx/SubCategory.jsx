import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress, Tooltip } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import { Base_Url, Image_Url, No_Image_Url } from "../../../config/BaseUrl";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import { ButtonCss } from "../../../components/common/ButtonCss";
const SubCategory = () => {
  const [loading, setLoading] = useState(true);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          return;
        }

        const response = await axios.get(
          `${Base_Url}/panel-fetch-sub-category-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSubCategoryData(response?.data?.categorySub || []);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return tableMeta.rowIndex + 1;
          },
        },
      },
      {
        name: "categories_sub_images",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <img
              src={
                value
                  ? `${Image_Url}/sub_categories_images/${value}`
                  : `${No_Image_Url}`
              }
              alt="Sub Category"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "category_name",
        label: "Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "category_sub_name",
        label: "Sub Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "category_sub_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "id",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <Tooltip title="Edit" placement="top">
              <span
                onClick={() => {
                  navigate(
                    `/master/subcategory/edit/${encodeURIComponent(
                      encryptId(value)
                    )}`
                  );
                }}
              >
                <EditIcon className="text-gray-600 hover:text-accent-500" />
              </span>
            </Tooltip>
          ),
        },
      },
    ],
    []
  );

  // Table options
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    textLabels: {
      body: {
        noMatch: loading ? <LoaderComponent /> : "Sorry, no data available",
      },
    },
    setRowProps: (row) => ({
      className: "hover:bg-gray-50 transition-colors",
    }),
    setTableProps: () => ({
      className: "rounded-lg shadow-sm border border-gray-200",
    }),
    customToolbar: () => (
      <button
        onClick={() => navigate("/master/subcategory/add")}
        className={ButtonCss}
      >
        + Add Category
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => subCategoryData, [subCategoryData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="SubCategory List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubCategory;
