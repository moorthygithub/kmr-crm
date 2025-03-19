import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Base_Url, Image_Url, No_Image_Url } from "../../config/BaseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
import LoaderComponent from "../../components/common/LoaderComponent";
import { encryptId } from "../../components/common/EncryptionDecryption";
import { ButtonCss } from "../../components/common/ButtonCss";
const Notification = () => {
  const [loading, setLoading] = useState(true);
  const [NotificationData, setNotificationData] = useState([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          return;
        }

        const response = await axios.get(
          `${Base_Url}/panel-fetch-notification-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotificationData(response?.data?.data || []);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
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
        name: "notification_image",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <img
              src={
                value
                  ? `${Image_Url}/notification_images/${value}?t=${RandomValue}`
                  : `${No_Image_Url}`
              }
              alt="Image"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "notification_create_date",
        label: "Create Date",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return moment(value).format("DD-MMM-YYYY");
          },
        },
      },
      {
        name: "notification_heading",
        label: "Heading",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "notification_status",
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
                    `/notification/edit/${encodeURIComponent(encryptId(value))}`
                  );
                }}
                className="cursor-pointer"
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
        onClick={() => navigate("/notification/add")}
        className={ButtonCss}
      >
        + Add Notification
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => NotificationData, [NotificationData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Notification List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Notification;
