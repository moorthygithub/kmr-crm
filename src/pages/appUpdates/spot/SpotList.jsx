import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Base_Url } from "../../../config/BaseUrl";

const SpotList = () => {
  const [spotRates, setSpotRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch spot rates data
  useEffect(() => {
    const fetchSpotRates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-spot-rates-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSpotRates(response?.data?.vendor || []);
      } catch (error) {
        console.error("Error fetching spot rates data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotRates();
  }, []);

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const dateTimeString = `${date} ${time}`;
    return moment(dateTimeString).format("DD MMM YYYY / hh:mm A");
  };

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
        name: "vendor_name",
        label: "Vendor",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "vendor_spot_heading",
        label: "Heading",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_spot_details",
        label: "Details",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_date_time",
        label: "Date/Time",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const data = spotRates[tableMeta.rowIndex];
            
            const formattedDateTime = formatDateTime(
              data.vendor_spot_created_date,  
              data.vendor_spot_created_time
            );
            return (
              <div className="text-sm">
                {formattedDateTime}
              </div>
            );
          },
        },
      },
      {
        name: "vendor_spot_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
        },
      },
    ],
    [spotRates] 
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
        onClick={() => navigate("/app-update/spot/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add Vendors Spot Rates List
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => spotRates, [spotRates]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Vendors Spot Rates List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SpotList;