import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MinimizeIcon from "@mui/icons-material/Minimize";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Moment from "moment";
import CountUp from "react-countup";
import LoaderComponent from "../../components/common/LoaderComponent";
import { FETCH_DASHBOARD_DATA } from "../api/UseApi";
import { Finacal_Year } from "../../config/BaseUrl";

const Dashboard = () => {
  const [results, setResults] = useState({});
  const [recentOrders, setRecentOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const response = await FETCH_DASHBOARD_DATA(Finacal_Year);
      setResults(response.data);
      setRecentOrders(response.data.validity_user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [Finacal_Year]);

  // Handle table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle table actions
  const handleReload = async () => {
    setLoading(true);
    try {
      const response = await FETCH_DASHBOARD_DATA(dateyear);
      setResults(response.data);
      setRecentOrders(response.data.validity_user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };
  const displayedOrders = recentOrders
    ? recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <Layout>
      <div className="space-y-6">
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
                end={results?.totalTrialUser_count || 0}
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
                end={results?.totalUser_count || 0}
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
                end={results?.renewal_count || 0}
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
                end={results?.totalInactiveUser_count || 0}
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
                <IconButton
                  size="small"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <ExpandMoreIcon /> : <MinimizeIcon />}
                </IconButton>
                <IconButton size="small" onClick={handleReload}>
                  <RefreshIcon />
                </IconButton>
                <IconButton size="small" onClick={() => setIsClosed(true)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>

            <Collapse in={!isMinimized}>
              {loading ? (
                <div className="flex justify-center">
                  <LoaderComponent />{" "}
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
