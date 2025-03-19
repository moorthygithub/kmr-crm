import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MUIDataTable from "mui-datatables";
import { Base_Url } from "../../../config/BaseUrl";
import moment from "moment";
import LoaderComponent from "../../../components/common/LoaderComponent";

const LiveList = () => {
  const [liveList, setLiveList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-live-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLiveList(response?.data?.vendor || []);
      } catch (error) {
        console.error("Error fetching live list data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveList();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Base_Url}/panel-fetch-category-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response?.data?.category || []);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchCategories();
  }, []);

  //fiter by categories

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      liveList.some(
        (item) => item.vendor_product_category === category.category_name
      )
    );
  }, [categories, liveList]);

  const filteredLiveList = useMemo(() => {
    if (selectedCategory === "all") {
      return liveList;
    }
    return liveList.filter(
      (item) => item.vendor_product_category === selectedCategory
    );
  }, [liveList, selectedCategory]);

  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const dateTimeString = `${date} ${time}`;
    return moment(dateTimeString).format("DD MMM YYYY / hh:mm A");
  };

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
        name: "vendor_name",
        label: "Vendor",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "vendor_product_category_sub",
        label: "Sub Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_product",
        label: "Product",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_product_size",
        label: "Size",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_product_rate",
        label: "Rate",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_date_time",
        label: "DateTime",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const data = liveList[tableMeta.rowIndex];

            if (
              data.vendor_product_updated_date &&
              data.vendor_product_updated_time
            ) {
              const formattedDateTime = formatDateTime(
                data.vendor_product_updated_date,
                data.vendor_product_updated_time
              );
              return (
                <div className="text-sm">
                  <span className="text-gray-600"></span>
                  {formattedDateTime}
                </div>
              );
            }

            const formattedDateTime = formatDateTime(
              data.vendor_product_created_date,
              data.vendor_product_created_time
            );
            return (
              <div className="text-sm">
                <span className="text-gray-600"></span>
                {formattedDateTime}
              </div>
            );
          },
        },
      },
      {
        name: "vendor_product_status",
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
          customBodyRender: (id) => (
            <Tooltip title="Edit" placement="top">
              <button
                onClick={() => navigate(`/app-update/live/edit/${id}`)}
                className="text-gray-500 hover:text-accent-500 transition-colors"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          ),
        },
      },
    ],
    [liveList]
  );

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
  };

  const data = useMemo(() => filteredLiveList, [filteredLiveList]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Category Filter Buttons */}
          <div className="p-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === "all"
                  ? "bg-accent-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.category_name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category.category_name
                    ? "bg-accent-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category.category_name}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <MUIDataTable
            title="Vendors Live List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default LiveList;
