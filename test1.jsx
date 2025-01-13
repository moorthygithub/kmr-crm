import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditRatesList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
    vendor_trader: "",
    vendor_status: "",
  });

  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // ... keeping the existing useEffect and handlers ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/app-update/rates")}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Vendor Rates</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Column 1 */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{vendor.vendor_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_address}</p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <select
                      name="vendor_status"
                      value={vendor.vendor_status}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select Status</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trader</label>
                    <p className="mt-1 text-gray-800">{vendor.vendor_trader}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-900">Sub Category</th>
                        <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-900">Product Name</th>
                        <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-900">Size</th>
                        <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-900">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {vendorProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {product.vendor_product_category_sub}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {product.vendor_product}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {product.vendor_product_size}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <input
                              type="number"
                              value={product.vendor_product_rate}
                              onChange={(e) => handleRateChange(e, index)}
                              className="w-32 rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/app-update/rates")}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditRatesList;