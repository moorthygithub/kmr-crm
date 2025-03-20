import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";

import { ArrowBack } from "@mui/icons-material";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";
import {
  CREATE_VENDOR_SPOT_RATES,
  VENDOR_SPOT_RATES_LIST_BY_ID,
} from "../../api/UseApi";

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
      try {
        const response = await VENDOR_SPOT_RATES_LIST_BY_ID();
        setVendorsData(response.data.vendor || []);
      } catch (error) {
        console.error("Error fetching vendors data:", error);
      }
    };

    fetchVendors();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vendor_id", addSpotRate.vendor_id);
    formData.append("vendor_spot_heading", addSpotRate.vendor_spot_heading);
    formData.append("vendor_spot_details", addSpotRate.vendor_spot_details);

    const formElement = document.getElementById("addSpotRateForm");

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);

      const res = await CREATE_VENDOR_SPOT_RATES(formData);

      if (res.data.code === 200) {
        toast.success(res.data.msg || "Data inserted successfully");
        navigate("/app-update/spot");
      } else {
        toast.error(res.data.msg || "Duplicate Entry");
        setIsButtonDisabled(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "An error occurred");
      setIsButtonDisabled(false);
    } finally {
      setLoading(false);
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
                className={ButtonCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={ButtonCss}
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
