import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../../config/BaseUrl";
import { toast } from "sonner";
import { ArrowBack } from "@mui/icons-material";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditSlider = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Slider, setSlider] = useState({
    slider_url: "",
    slider_images: "",
    slider_status: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await axios.get(
          `${Base_Url}/panel-fetch-slider-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSlider(response.data.slider);
      } catch (error) {
        console.error("Error fetching slider data:", error);
        toast.error("Failed to fetch sliderr data.");
      }
    };

    fetchSlider();
  }, [id]);

  // Handle input change
  const onInputChange = (e) => {
    setSlider({
      ...Slider,
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
    formData.append("slider_url", Slider.slider_url);
    formData.append("slider_status", Slider.slider_status);
    if (selectedFile) {
      formData.append("slider_images", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.post(
        `${Base_Url}/panel-update-slider/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code == 200) {
        navigate("/app-update/slider");
        toast.success(response.data.msg || "Data updated successfully");
      } else {
        toast.error(response.data.msg || "Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Failed to update slider.");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  const RandomValue = Date.now();

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/app-update/slider")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit Slider
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-6 lg:space-y-0 flex flex-col lg:flex-row gap-0 lg:gap-2">
              <div className="flex justify-start">
                <img
                  src={
                    Slider?.slider_images === null ||
                    Slider?.slider_images === ""
                      ? "https://kmrlive.in/storage/app/public/no_image.jpg"
                      : `https://kmrlive.in/storage/app/public/slider_images/${Slider.slider_images}?t=${RandomValue}`
                  }
                  alt="Slider"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Url <span className="text-red-700">*</span>
                  </label>
                  <textarea
                    name="slider_url"
                    value={Slider.slider_url}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Description Details"
                    required
                  />
                </div>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    name="slider_images"
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
                    name="slider_status"
                    value={Slider.slider_status}
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
                onClick={() => navigate("/app-update/slider")}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditSlider;
