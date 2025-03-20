import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCss } from "../../../components/common/ButtonCss";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import LoaderComponent from "../../../components/common/LoaderComponent";
import Layout from "../../../components/Layout";
import { Image_Url, No_Image_Url } from "../../../config/BaseUrl";
import { VENDOR_NEWS_LIST } from "../../api/UseApi";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await VENDOR_NEWS_LIST();

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
                <span
                  onClick={() => {
                    navigate(
                      `/app-update/news/edit/${encodeURIComponent(
                        encryptId(value)
                      )}`
                    );
                  }}
                >
                  <EditIcon className="text-gray-600 hover:text-accent-500" />
                </span>
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
        className={ButtonCss}
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
