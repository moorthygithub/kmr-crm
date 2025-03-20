import { ArrowBack } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import {
  EditLoaderComponent,
  ImageLoaderComponent,
} from "../../../components/common/LoaderComponent";
import Layout from "../../../components/Layout";
import { Image_Url, No_Image_Url } from "../../../config/BaseUrl";
import {
  FETCH_SUB_CATEGORY_BY_ID,
  SUB_FETCH_CATEGORY,
  UPDATE_SUB_CATEGORY,
} from "../../api/UseApi";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [subcategory, setSubCategory] = useState({
    category_id: "",
    category_sub_name: "",
    category_sub_status: "",
    categories_sub_images: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorydata, setCategorydata] = useState([]);
  const [imageloading, setImageLoading] = useState(true);
  const [loadingdata, setLoadingData] = useState(false);

  // Fetch subcategory data by ID
  useEffect(() => {
    const fetchSubCategory = async () => {
      setLoadingData(true);

      try {
        const response = await FETCH_SUB_CATEGORY_BY_ID(decryptedId);
        setSubCategory(response.data.categorySub);
      } catch (error) {
        console.error("Error fetching subcategory data:", error);
        toast.error("Failed to fetch subcategory data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchSubCategory();
  }, [decryptedId]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await SUB_FETCH_CATEGORY();
        setCategorydata(response.data.category || []);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  // Handle input change
  const onInputChange = (e) => {
    setSubCategory({
      ...subcategory,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", subcategory.category_id);
    formData.append("category_sub_name", subcategory.category_sub_name);
    formData.append("category_sub_status", subcategory.category_sub_status);
    if (selectedFile) {
      formData.append("categories_sub_images", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await UPDATE_SUB_CATEGORY(decryptedId, formData);
      if (response.data.code == 200) {
        navigate("/master/subcategory");
        toast.success(response.data.msg || "Data updated successfully");
      } else {
        toast.error(response.data.msg || "Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Failed to update subcategory.");
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
            onClick={() => navigate("/master/subcategory")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit SubCategory
          </h1>
        </div>

        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-6 lg:space-y-0 flex flex-col lg:flex-row gap-0 lg:gap-2">
                <div className="relative w-48 h-54 flex justify-center items-center">
                  {imageloading && <ImageLoaderComponent />}

                  <img
                    src={
                      subcategory?.categories_sub_images === null ||
                      subcategory?.categories_sub_images === ""
                        ? `${No_Image_Url}`
                        : `${Image_Url}/sub_categories_images/${subcategory.categories_sub_images}`
                    }
                    alt="Sub Category"
                    className={`w-48 h-54 object-cover rounded-lg transition-opacity duration-300 ${
                      imageloading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
                <div className="flex-1">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={subcategory.category_id}
                      onChange={onInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {categorydata.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SubCategory Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SubCategory Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="category_sub_name"
                      value={subcategory.category_sub_name}
                      onChange={onInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter SubCategory Name"
                      required
                      disabled
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      name="categories_sub_images"
                      onChange={onFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      accept=".jpg, .png"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="category_sub_status"
                      value={subcategory.category_sub_status}
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
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/master/subcategory")}
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

export default EditSubCategory;
