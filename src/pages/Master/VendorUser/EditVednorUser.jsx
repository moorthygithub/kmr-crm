import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Base_Url } from "../../../config/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { ArrowBack } from "@mui/icons-material";
import { EditLoaderComponent } from "../../../components/common/LoaderComponent";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditVednorUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [vendorUser, setVendorUser] = useState({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingdata, setLoadingData] = useState(false);

  // Fetch vendor user data by ID
  useEffect(() => {
    const fetchVendorUser = async () => {
      setLoadingData(true);

      try {
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-user-by-id/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVendorUser(response.data.adminUser);
      } catch (error) {
        console.error("Error fetching vendor user data:", error);
        toast.error("Failed to fetch vendor user data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendorUser();
  }, [decryptedId]);

  // Handle input change
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setVendorUser({
      ...vendorUser,
      [name]: value,
    });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", vendorUser.name);
    formData.append("mobile", vendorUser.mobile);
    formData.append("email", vendorUser.email);
    formData.append("remarks", vendorUser.remarks);
    formData.append("status", vendorUser.status);

    const isFormValid = document
      .getElementById("editVendorUserForm")
      .checkValidity();
    document.getElementById("editVendorUserForm").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      try {
        const response = await axios.post(
          `${Base_Url}/panel-update-vendor-user/${decryptedId}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.code == 200) {
          navigate("/master/vendor-user");
          toast.success(response.data.msg || "Data updated successfully");
        } else {
          toast.error(response.data.msg || "Duplicate Entry");
        }
      } catch (error) {
        console.error("Error updating vendor user:", error);
        toast.error("Failed to update vendor user.");
      } finally {
        setIsButtonDisabled(false);
        setLoading(false);
      }
    }
  };
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/master/vendor-user")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit Vendor User
          </h1>
        </div>
        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form
              id="editVendorUserForm"
              autoComplete="off"
              onSubmit={onSubmit}
            >
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={vendorUser.name}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Name"
                    required
                    disabled
                  />
                </div>

                {/* Mobile Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={vendorUser.mobile}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Mobile"
                    inputMode="numeric"
                    maxLength={10}
                    minLength={10}
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={vendorUser.email}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Email"
                    required
                  />
                </div>

                {/* Remarks Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="remarks"
                    value={vendorUser.remarks}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Remarks"
                    required
                  />
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-700">*</span>
                  </label>
                  <select
                    name="status"
                    value={vendorUser.status}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    required
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/master/vendor-user")}
                  className={ButtonCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={ButtonCss}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditVednorUser;
