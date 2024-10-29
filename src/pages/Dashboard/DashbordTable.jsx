import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Collapse,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import MinimizeIcon from "@mui/icons-material/Minimize";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Moment from "moment";
import { baseURL } from "../../api/api";

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getRecentOrders();
  }, []);

  const getRecentOrders = () => {
    const dateyear = "2024";
    axios({
      url: `${baseURL}/panel-fetch-dashboard-data/${dateyear}`,
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
        alert("Something went wrong!");
        setLoading(false);
      });
  };

  const handleReload = () => {
    setLoading(true);
    getRecentOrders();
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedOrders = recentOrders
    ? recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return !isClosed ? (
    <Paper sx={{ padding: 2, margin: 3, maxWidth: "100%" ,}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Renewal Dues</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={handleMinimize}
            sx={{ paddingBottom: "17px" }}
          >
            {isMinimized ? <ExpandMoreIcon /> : <MinimizeIcon />}
          </IconButton>
          <IconButton size="small" onClick={handleReload}>
            <RefreshIcon />
          </IconButton>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Table */}
      <Collapse in={!isMinimized}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Validity</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedOrders && displayedOrders.length > 0 ? (
                    displayedOrders.map((order, key) => (
                      <TableRow key={key}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>{order.mobile}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>
                          {Moment(order.validity_date).format("DD-MM-YYYY")}
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
            />
          </>
        )}
      </Collapse>
    </Paper>
  ) : null;
};

export default RecentOrders;
