import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";

import CountUp from "react-countup";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Collapse,
  TablePagination,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Moment from "moment";
import { Base_Url } from "../../config/BaseUrl";

const Dashboard = () => {
  const [results, setResults] = useState({});
  const [recentOrders, setRecentOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dateyear = "2024";

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: `${Base_Url}/panel-fetch-dashboard-data/${dateyear}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setResults(response.data);
        setRecentOrders(response.data.validity_user);
        setLoading(false);

        // Store data in localStorage
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
        setLoading(false);
      }
    };

    fetchData();
  }, [dateyear]);

  // Handle table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle table actions
  const handleReload = () => {
    setLoading(true);
    axios({
      url: `${Base_Url}/panel-fetch-dashboard-data/${dateyear}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setRecentOrders(res.data.validity_user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error reloading data:", error);
        setLoading(false);
      });
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  // Get data from localStorage
  const totalTrialUserCount = localStorage.getItem("totalTrialUser_count") || 0;
  const totalInactiveUserCount =
    localStorage.getItem("totalInactiveUser_count") || 0;
  const totalUserCount = localStorage.getItem("totalUser_count") || 0;
  const renewalCount = localStorage.getItem("renewal_count") || 0;

  // Displayed orders for pagination
  const displayedOrders = recentOrders
    ? recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Trial Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Trial Users
            </p>
            <p className="text-3xl font-bold text-green-500 mt-2">
              <CountUp
                start={0}
                end={totalTrialUserCount}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>

          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-blue-500 mt-2">
              <CountUp
                start={0}
                end={totalUserCount}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>

          {/* Renewal Count Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">Renewal Count</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              <CountUp
                start={0}
                end={renewalCount}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>

          {/* Inactive Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">Inactive Users</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              <CountUp
                start={0}
                end={totalInactiveUserCount}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>
        </div>

        {/* Table Section */}
        {!isClosed && (
          <Paper className="rounded-lg shadow-sm overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Renewal Dues
              </h2>
              <div className="flex items-center space-x-2">
                <IconButton size="small" onClick={handleMinimize}>
                  {isMinimized ? <ExpandMoreIcon /> : <MinimizeIcon />}
                </IconButton>
                <IconButton size="small" onClick={handleReload}>
                  <RefreshIcon />
                </IconButton>
                <IconButton size="small" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>

            <Collapse in={!isMinimized}>
              {loading ? (
                <div className="flex justify-center p-6">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className="bg-gray-50">
                          <TableCell className="font-semibold text-gray-700">
                            ID
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Full Name
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Mobile
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Email
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Validity
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedOrders && displayedOrders.length > 0 ? (
                          displayedOrders.map((order, key) => (
                            <TableRow key={key} className="hover:bg-gray-50">
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.name}</TableCell>
                              <TableCell>{order.mobile}</TableCell>
                              <TableCell>{order.email}</TableCell>
                              <TableCell>
                                {Moment(order.validity_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </TableCell>
                              <TableCell>{order.status}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No recent orders available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={recentOrders ? recentOrders.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Rows per page"
                    className="border-t border-gray-200"
                  />
                </>
              )}
            </Collapse>
          </Paper>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
