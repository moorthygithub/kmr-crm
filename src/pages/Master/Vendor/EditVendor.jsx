import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../../config/BaseUrl";
import { toast } from "sonner";
import { ArrowBack } from "@mui/icons-material";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import { EditLoaderComponent } from "../../../components/common/LoaderComponent";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const traderOptions = [
  { value: "1", label: "Live" },
  { value: "2", label: "Rates" },
  { value: "3", label: "Spot Rates" },
];

const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
    vendor_trader: "",
    vendor_no_of_products: "",
    vendor_status: "",
  });

  const [vendorProducts, setVendorProducts] = useState([
    {
      id: "",
      vendor_product_category_sub: "",
      vendor_product: "",
      vendor_product_size: "",
      vendor_product_rate: "0",
    },
  ]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingdata, setLoadingData] = useState(false);

  // Fetch vendor data by ID
  useEffect(() => {
    const fetchVendor = async () => {
      setLoadingData(true);

      try {
        const response = await axios.get(
          `${Base_Url}/panel-fetch-vendor-by-id/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVendor(response.data.vendor);
        setVendorProducts(response.data.vendorSub);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to fetch vendor data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendor();
  }, [decryptedId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Base_Url}/panel-fetch-category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data.category);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (vendor.vendor_category) {
        try {
          const response = await axios.get(
            `${Base_Url}/panel-fetch-sub-category/${vendor.vendor_category}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSubCategories(response.data.categorySub);
        } catch (error) {
          toast.error("Failed to fetch subcategories.");
        }
      }
    };

    fetchSubCategories();
  }, [vendor.vendor_category]);

  // Handle input change for vendor details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({ ...prevVendor, [name]: value }));
  };

  // Handle input change for product details
  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...vendorProducts];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setVendorProducts(updatedProducts);
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...vendor,
      vendorProduct_sub_data: vendorProducts,
    };

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.put(
        `${Base_Url}/panel-update-vendor/${decryptedId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        navigate("/master/vendor");
        toast.success(response.data.msg || "Data updated successfully");
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Duplicate Entry.");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/master/vendor")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit Vendor
          </h1>
        </div>
        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-6">
                {/* Vendor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_name"
                      value={vendor.vendor_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Vendor Name"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_mobile"
                      value={vendor.vendor_mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Mobile"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="email"
                      name="vendor_email"
                      value={vendor.vendor_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_address"
                      value={vendor.vendor_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_city"
                      value={vendor.vendor_city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="vendor_category"
                      value={vendor.vendor_category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((option) => (
                        <option key={option.id} value={option.category_name}>
                          {option.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trader <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_trader"
                      value={vendor.vendor_trader}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Trader"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="vendor_status"
                      value={vendor.vendor_status}
                      onChange={handleInputChange}
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

                {/* Product Details */}
                {vendorProducts.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category <span className="text-red-700">*</span>
                      </label>
                      <select
                        name="vendor_product_category_sub"
                        value={product.vendor_product_category_sub}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select Sub Category
                        </option>
                        {subcategories.map((option) => (
                          <option
                            key={option.id}
                            value={option.category_sub_name}
                          >
                            {option.category_sub_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        name="vendor_product"
                        value={product.vendor_product}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Product Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        name="vendor_product_size"
                        value={product.vendor_product_size}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Size"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="number"
                        name="vendor_product_rate"
                        value={product.vendor_product_rate}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Rate"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/master/vendor")}
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

export default EditVendor;
