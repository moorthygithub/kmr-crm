import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, MenuItem, Grid, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../api/api";
import "react-toastify/dist/ReactToastify.css";
import ProfileTitle from "../../common/ProfileTitle";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const [news, setNews] = useState({
    news_headlines: "",
    news_content: "",
    news_image: "",
    news_status: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/panel-fetch-news-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNews(response.data.news);
      } catch (error) {
        console.error("Error fetching news data:", error);
        toast.error("Failed to fetch news data.");
      }
    };

    fetchNews();
  }, [id]);

  const onInputChange = (e) => {
    setNews({
      ...news,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("news_headlines", news.news_headlines);
    formData.append("news_content", news.news_content);
    formData.append("news_status", news.news_status);
    if (selectedFile) {
      formData.append("news_image", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/panel-update-news/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code === 200) {
        toast.success(response.data.msg || "Data updated successfully", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/news");
        }, 2000);
      } else {
        toast.error(response.data.msg || "Duplicate Entry", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news.");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: "100px" }}>
      <ProfileTitle title="Edit News" backLink="/news" />
      <Box
        sx={{
          padding: "5%",
          boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px,
                      rgba(0, 0, 0, 0.12) 0px -12px 30px,
                      rgba(0, 0, 0, 0.12) 0px 4px 6px,
                      rgba(0, 0, 0, 0.17) 0px 12px 13px,
                      rgba(0, 0, 0, 0.09) 0px -3px 5px`,
        }}
      >
        <ToastContainer autoClose={3000} />

        <form autoComplete="off" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="News Headlines"
                name="news_headlines"
                value={news.news_headlines}
                onChange={onInputChange}
                variant="standard"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="News Content"
                name="news_content"
                variant="outlined"
                multiline
                rows={4}
                value={news.news_content}
                onChange={onInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="file"
                InputLabelProps={{ shrink: true }}
                label="Image"
                name="news_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                variant="standard"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                select
                label="Status"
                name="news_status"
                value={news.news_status}
                onChange={onInputChange}
                variant="standard"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isButtonDisabled || loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/news")}
                >
                  Back
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Edit;
