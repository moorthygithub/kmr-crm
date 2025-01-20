import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import { Base_Url } from "../../../config/BaseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [SliderData, setSliderData] = useState([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          return;
        }

        const response = await axios.get(
          `${Base_Url}/panel-fetch-slider-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSliderData(response?.data?.slider || []);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, []);
  const RandomValue = Date.now();

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
        name: "slider_images",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <img
              src={
                value
                  ? `https://kmrlive.in/storage/app/public/slider_images/${value}?t=${RandomValue}`
                  : "https://kmrlive.in/storage/app/public/no_image.jpg"
              }
              alt="Image"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "slider_url",
        label: "Url",
        options: {
          filter: true,
          sort: false,
        },
      },

      {
        name: "slider_status",
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
              <Link to={`/app-update/slider/edit/${value}`}>
                <EditIcon className="text-gray-600 hover:text-accent-500" />
              </Link>
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
        noMatch: loading ? (
          <CircularProgress className="text-accent-500" />
        ) : (
          "Sorry, no data available"
        ),
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
        onClick={() => navigate("/app-update/slider/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add Slider
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => SliderData, [SliderData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Slider List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Slider;
