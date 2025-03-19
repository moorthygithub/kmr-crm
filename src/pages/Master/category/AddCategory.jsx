import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../../config/BaseUrl";
import { toast } from "sonner";
import { ArrowBack } from "@mui/icons-material";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    category_name: "",
    categories_images: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", category.category_name);
    if (selectedFile) {
      formData.append("categories_images", selectedFile);
    }
    const isFormValid = document
      .getElementById("addCategoryForm")
      .checkValidity();
    document.getElementById("addCategoryForm").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      await axios({
        url: `${Base_Url}/panel-create-category`,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            navigate("/master/category");
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
            onClick={() => navigate("/master/category")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Category
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addCategoryForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={category.category_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Category Name"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-700">*</span>
                </label>
                <input
                  type="file"
                  name="categories_images"
                  onChange={onFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/master/category")}
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

export default AddCategory;
