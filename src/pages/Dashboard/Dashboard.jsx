import React, { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import TotalTrail from "../Dashboard/TotalTrail";
import axios from "axios";
import { baseURL } from "../../api/api";
import RecentOrders from "./DashbordTable";

function Dashbord() {
  const [results, setResults] = useState({});
  const dateyear = "2024";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: `${baseURL}/panel-fetch-dashboard-data/${dateyear}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setResults(response.data);
        console.log(response.data, "datafor dashbaord");
        localStorage.setItem("totalUser_count", response.data.totalUser_count);
        localStorage.setItem(
          "totalInactiveUser_count",
          response.data.totalInactiveUser_count
        );
        localStorage.setItem(
          "totalTrialUser_count",
          response.data.totalTrialUser_count
        );
        localStorage.setItem("renewal_count", response.data.renewal_count);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [dateyear]);

  return (
    <Card
      sx={{
        bgcolor: grey[100],
         marginTop: "100px",
        padding: "16px",
        marginLeft: "0px",
        borderRadius: "15px",
      }}
    >
      <TotalTrail />
      <RecentOrders />
    </Card>
  );
}

export default Dashbord;
