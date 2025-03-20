import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCss } from "../../../components/common/ButtonCss";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import LoaderComponent from "../../../components/common/LoaderComponent";
import Layout from "../../../components/Layout";
import { CATEGORY_LIST, VENDOR_LIST } from "../../api/UseApi";

const RatesList = () => {
  const [rates, setRates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await VENDOR_LIST();

        setRates(response?.data?.vendor || []);
      } catch (error) {
        console.error("Error fetching rates data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CATEGORY_LIST();

        setCategories(response?.data?.category || []);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchCategories();
  }, []);

  // category_name - categorries

  // vendor_category - rate list
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      rates.some((item) => item.vendor_category === category.category_name)
    );
  }, [categories, rates]);

  const filteredRates = useMemo(() => {
    if (selectedCategory === "all") {
      return rates;
    }
    return rates.filter((rate) => rate.vendor_category === selectedCategory);
  }, [rates, selectedCategory]);

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
                onClick={() => {
                  navigate(
                    `/app-update/rates/edit/${encodeURIComponent(
                      encryptId(value)
                    )}`
                  );
                }}
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
        onClick={() => navigate("/app-update/rates/add")}
        className={ButtonCss}
      >
        + Add Rate
      </button>
    ),
  };

  const data = useMemo(() => filteredRates, [filteredRates]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
          <MUIDataTable
            title="Vendor Rates List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RatesList;
