import React, { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStatus = async () => {
    const storedToken = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "https://kmrlive.in/public/api/panel-check-status",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response content-type:", response.headers["content-type"]);

      // Handle JSON responses
      if (response.headers["content-type"]?.includes("application/json")) {
        const data = response.data;

        if (data?.success) {
          setStatusData(data);
          setError(false);
        } else {
          setError(true);
        }
      } else if (response.headers["content-type"]?.includes("text/html")) {
        console.error("Unexpected HTML response received");
        console.log("HTML content:", response.data);
        // setError(true);
      } else {
        console.error("Unexpected response type");
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 6000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (statusData?.success) {
      if (token) {
        if (currentPath === "/login" || currentPath === "/signup") {
          navigate("/dashboard");
        }
      } else {
        if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !=="/forgot") {
          navigate("/login");
        }
      }
    }
  }, [statusData, error, location.pathname, navigate]);

  return (
    <StatusContext.Provider value={{ statusData }}>
      {children}
    </StatusContext.Provider>
  );
};
