import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../../config/BaseUrl";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Tooltip } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import LoaderComponent from "../../../components/common/LoaderComponent";

const VendorUserList = () => {
  const [vendorUserData, setVendorUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-user-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendorUserData(response?.data?.adminUser || []);
      } catch (error) {
        console.error("Error fetching vendor user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorUser();
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
        name: "name",
        label: "Full Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },

      {
        name: "status",
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
                onClick={() => navigate(`/master/vendor-user/edit/${value}`)}
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
        onClick={() => navigate("/master/vendor-user/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add Vendor User
      </button>
    ),
  };

  const data = useMemo(() => vendorUserData, [vendorUserData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Vendor User List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VendorUserList;
