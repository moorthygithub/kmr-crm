import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../../../config/BaseUrl";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Tooltip } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

const VendorList = () => {
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendorData(response?.data?.vendor || []);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

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
        name: "vendor_mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_category",
        label: "Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_trader",
        label: "Trader",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_no_of_products",
        label: "No of Products",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_status",
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
              <button
                onClick={() => navigate(`/master/vendor/edit/${value}`)}
                className="text-gray-500 hover:text-accent-500 transition-colors"
              >
                <EditIcon className="w-4 h-4" />
              </button>
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
        onClick={() => navigate("/master/vendor/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add Vendor
      </button>
    ),
  };

  const data = useMemo(() => vendorData, [vendorData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Vendor  List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VendorList;
