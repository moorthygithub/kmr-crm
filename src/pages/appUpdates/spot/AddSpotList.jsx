import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import { Base_Url } from "../../../config/BaseUrl";
import { toast } from "sonner";

const AddSpotList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addSpotRate, setAddSpotRate] = useState({
    vendor_id: "",
    vendor_spot_heading: "",
    vendor_spot_details: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const onInputChange = (e) => {
    setAddSpotRate({
      ...addSpotRate,
      [e.target.name]: e.target.value,
    });
  };

  const [vendorsData, setVendorsData] = useState([]);
  useEffect(() => {
    const fetchVendors = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${Base_Url}/panel-fetch-vendor/3`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendorsData(response.data.vendor || []);
      } catch (error) {
        console.error("Error fetching vendors data:", error);
      }
    };

    fetchVendors();
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vendor_id", addSpotRate.vendor_id);
    formData.append("vendor_spot_heading", addSpotRate.vendor_spot_heading);
    formData.append("vendor_spot_details", addSpotRate.vendor_spot_details);

    const isFormValid = document
      .getElementById("addSpotRateForm")
      .checkValidity();
    document.getElementById("addSpotRateForm").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      axios({
        url: `${Base_Url}/panel-create-vendor-spot-rates`,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            navigate("/app-update/spot");
            toast.success(res.data.msg || "Data inserted successfully");
          } else {
            toast.error(res.data.msg || "Duplicate Entry");
            setIsButtonDisabled(false);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.msg || "An error occurred");
          setIsButtonDisabled(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/app-update/spot")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Spot Rate
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addSpotRateForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor <span className="text-red-700">*</span>
                </label>
                <select
                  name="vendor_id"
                  value={addSpotRate.vendor_id}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>
                  {vendorsData.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heading Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="vendor_spot_heading"
                  value={addSpotRate.vendor_spot_heading}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Heading"
                  required
                />
              </div>

              {/* Spot Details Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spot Details <span className="text-red-700">*</span>
                </label>
                <textarea
                  name="vendor_spot_details"
                  value={addSpotRate.vendor_spot_details}
                  onChange={onInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Spot Details"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/app-update/spot")}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddSpotList;
