import axios from "axios";
import { Base_Url } from "../../config/BaseUrl";
////////////////////*****************All Api is Called Here Except UseManagement Page And Sigin And Forgot Password************************************** */

// Generic API Request Function
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method,
      url: `${Base_Url}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}`, error);
    return { code: 500, msg: "Internal Server Error" };
  }
};
export const FETCH_DASHBOARD_DATA = (dateyear) =>
  apiRequest("GET", `/panel-fetch-dashboard-data/${dateyear}`);
