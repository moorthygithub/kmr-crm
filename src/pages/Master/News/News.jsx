import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL } from "../../../api/api"
import axios from "axios";
import Moment from "moment";
import PageTitleBar from "../../common/ProfileTitle";

// const options = {
//   filterType: "dropdown",
//   selectableRows: "none",
//   responsive: "standard",
//   tableBodyHeight: "200px",
//   emptyRowsWhenPaging: false,
// };

const News = () => {
  const [loader, setLoader] = useState(true);
  const [news, setNews] = useState([]);

  const getData = async () => {
    setLoader(true);

    try {
      const response = await axios.get(`${baseURL}/panel-fetch-news-list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newsData = response.data.news;
      const tempRows = newsData.map((item, index) => [
        index + 1,
        <img
          src={
            item.news_image
              ? `https://kmrlive.in/storage/app/public/News/${item.news_image}`
              : "https://kmrlive.in/storage/app/public/no_image.jpg"
          }
          alt="News"
          style={{ width: "40px", height: "40px" }}
        />,
        Moment(item.news_created_date).format("DD-MM-YYYY"),
        item.news_headlines,
        item.news_content,
        item.news_status,
        item.id,
      ]);

      setNews(tempRows);
    } catch (error) {
      console.error("Error fetching news data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box className="data-table-wrapper" sx={{ p: 2, marginTop: "80px" }}>
      {loader ? (
        <CircularProgress
          disableShrink
          sx={{
            margin: "300px auto",
            display: "block",
          }}
          color="secondary"
        />
      ) : (
        <>
          <PageTitleBar
            title="News"
            backLink="-1"
            buttonLabel="+ Add News"
            buttonLink="/News/add"
          />
          <MUIDataTable
            title={"News List"}
            data={news.length > 0 ? news : []}
            columns={[
              {
                name: "#",
                options: { filter: false, print: false, download: false },
              },
              {
                name: "Images",
                options: { filter: false, print: false, download: false },
              },
              "Date",
              "Headlines",
              "Content",
              "Status",
              {
                name: "Actions",
                options: {
                  
                  filter: false,
                  print: false,
                  download: false,
                  customBodyRender: (value) => (
                    <Tooltip title="Edit" placement="top">
                      <IconButton>
                        <Link to={"edit?id=" + value}>
                          <EditIcon />
                        </Link>
                      </IconButton>
                    </Tooltip>
                  ),
                },
              },
            ]}
            options={{
              print:false,
              download:false,
              filterType: "dropdown",
              selectableRows: "none",
              textLabels: {
                body: {
                  noMatch: (
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      Sorry, no matching records found
                    </Typography>
                  ),
                },
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default News;
