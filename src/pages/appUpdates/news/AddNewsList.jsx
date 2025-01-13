import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import { Base_Url } from "../../../config/BaseUrl";
import { toast } from "sonner";

const AddNewsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState({
    news_headlines: "",
    news_content: "",
    news_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Handle input change
  const onInputChange = (e) => {
    setNews({
      ...news,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("news_headlines", news.news_headlines);
    formData.append("news_content", news.news_content);
    if (selectedFile) {
      formData.append("news_image", selectedFile);
    }

    const isFormValid = document.getElementById("addNewsForm").checkValidity();
    document.getElementById("addNewsForm").reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      axios({
        url: `${Base_Url}/panel-create-news`,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            navigate("/app-update/news");
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
            onClick={() => navigate("/app-update/news")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create News
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addNewsForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Headlines Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headlines <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="news_headlines"
                  value={news.news_headlines}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Headlines"
                  required
                />
              </div>

              {/* News Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Content <span className="text-red-700">*</span>
                </label>
                <textarea
                  name="news_content"
                  value={news.news_content}
                  onChange={onInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter News Content"
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
                  name="news_image"
                  onChange={onFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  accept=".jpg, .png"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/app-update/news")}
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

export default AddNewsList;
