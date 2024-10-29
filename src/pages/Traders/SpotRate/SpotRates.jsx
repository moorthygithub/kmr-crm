import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { baseURL } from "../../../api/api";
import axios from "axios";
import ProfileTitle from "../../common/ProfileTitle";
import Moment from "moment";
import { ViewColumn } from "@mui/icons-material";

const TradersSpotRates = () => {
  const [loader, setLoader] = useState(true);
  const [SpotRate, setSpotRate] = useState([]);
  const navigate = useNavigate();

  const columnData = [
    {
      name: "#",
      options: {
        filter: false,
        print: false,
        download: false,
      },
    },
    "Vendor",
    "heading",
    "Details",
    "Date/Time",
    "Status",
  ];

  const options = {
    print: false,
    download: false,
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
            Sorry, no data available
          </Typography>
        ),
      },
    },
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/panel-fetch-vendor-spot-rates-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.vendor);
      const tempRows = response.data.vendor.map((item, index) => {
        const formattedDate =
          item.vendor_product_updated_date <= 0
            ? Moment(item.vendor_product_created_date).format("DD-MM-YYYY") +
              " / " +
              item.vendor_spot_created_time
            : Moment(item.vendor_product_updated_date).format("DD-MM-YYYY") +
              " / " +
              item.vendor_spot_created_time;

        return [
          index + 1,
          item.vendor_name,
          item.vendor_spot_heading,
          item.vendor_spot_details,
          formattedDate,
          item.vendor_spot_status,
          item.id,
        ];
      });
      setSpotRate(tempRows);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="data-table-wrapper" style={{ marginTop: "100px" }}>
      {loader ? (
        <CircularProgress
          disableShrink
          style={{
            marginLeft: "600px",
            marginTop: "300px",
            marginBottom: "300px",
          }}
          color="secondary"
        />
      ) : (
        <>
          <ProfileTitle
            title="Vendors Spot Rates List"
            backLink="-1"
            buttonLabel="+ Add Vendors Spot Rates List"
            buttonLink="/traders/spotrates/add"
          />
          <MUIDataTable
            title={"Vendors Spot Rates List"}
            data={SpotRate}
            columns={columnData}
            options={options}
          />
        </>
      )}
    </div>
  );
};

export default TradersSpotRates;
