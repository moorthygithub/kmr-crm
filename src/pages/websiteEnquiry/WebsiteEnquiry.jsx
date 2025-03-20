import { CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { WEBSITE_ENQUIRY } from "../api/UseApi";
const WebsiteEnquiry = () => {
  const [loading, setLoading] = useState(true);
  const [WebsiteEnquiryData, setWebsiteEnquiryData] = useState([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchWebsiteEnquiry = async () => {
      try {
        const response = await WEBSITE_ENQUIRY();

        setWebsiteEnquiryData(response?.data?.contact || []);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteEnquiry();
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
        name: "contact_name",
        label: "Name",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_message",
        label: "Message",
        options: {
          filter: true,
          sort: false,
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
  };

  // Data for the table
  const data = useMemo(() => WebsiteEnquiryData, [WebsiteEnquiryData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <MUIDataTable
            title="Website Enquiry List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WebsiteEnquiry;
