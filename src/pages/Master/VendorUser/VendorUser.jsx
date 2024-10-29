import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
  TableCell,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL } from "../../../api/api";
import axios from "axios";
import ProfileTitle from "../../common/ProfileTitle";

const NewListVendor = () => {
  const [loader, setLoader] = useState(true);
  const [vendorUserData, setVendorUserData] = useState([]);
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
    "Full Name",
    "Mobile",
    "Email",
    "Status",
    {
      name: "Actions",
      options: {
        filter: false,
        print: false,
        download: false,
        customBodyRender: (id) => (
          <Tooltip title="Edit" placement="top">
            <IconButton
              aria-label="Edit"
              onClick={() => navigate(`/vendoruser/edit?id=${id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    },
  ];

  const options = {
    print: false,
    download: false,
    filterType: "dropdown",
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: (
          <TableCell
            colSpan={columnData.length}
            sx={{
              marginTop: "20px",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">Sorry, no data available</Typography>
          </TableCell>
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
        `${baseURL}/panel-fetch-vendor-user-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("respoonse", response.data.adminUser);
      const tempRows = response.data.adminUser.map((item, index) => [
        index + 1,
        item.name,
        item.mobile,
        item.email,
        item.status,
        item.id,
      ]);
      console.log(tempRows);
      setVendorUserData(tempRows);
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
            title="Vendor User List"
            backLink="-1"
            buttonLabel="+ Add Vendor User"
            buttonLink="/vendoruser/add"
          />
          <MUIDataTable
            title={"Vendor List"}
            data={vendorUserData}
            columns={columnData}
            options={options}
          />
        </>
      )}
    </div>
  );
};

export default NewListVendor;
