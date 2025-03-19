import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Base_Url, Image_Url, No_Image_Url } from "../../../config/BaseUrl";
import LoaderComponent from "../../../components/common/LoaderComponent";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${Base_Url}/panel-fetch-news-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNews(response?.data?.news || []);
      } catch (error) {
        console.error("Error fetching news data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
        name: "news_image",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <img
              src={value ? `${Image_Url}/News/${value}` : `${No_Image_Url}`}
              alt="News"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "news_created_date",
        label: "Date",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => (
            <div className="text-sm">{moment(value).format("DD-MM-YYYY")}</div>
          ),
        },
      },
      {
        name: "news_headlines",
        label: "Headlines",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "news_content",
        label: "Content",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "news_status",
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
              <IconButton>
                <Link to={`/app-update/news/edit/${value}`}>
                  <EditIcon className="text-gray-600 hover:text-accent-500" />
                </Link>
              </IconButton>
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
        onClick={() => navigate("/app-update/news/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add News
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => news, [news]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="News List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default NewsList;
