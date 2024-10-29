import React from "react";
import "./App.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/Signup";
import ForgotPassword from "../src/pages/Login/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Layout from "./pages/Layout/Layout";
import Profile from "../src/pages/Profile/Profile";
// import RegisterForm from "./pages/RegisterForm/RegisterForm";
import { StatusProvider } from "./pages/Login/StatusCheck";
import Maintance from "./pages/Maintance/Maintaince";
///////////////MASTER///////////////////////////////
import Category from "../src/pages/Master/Categorys/Category";
import Addcategory from "../src/pages/Master/Categorys/Addcategory";
import SubCategory from "../src/pages/Master/SubCategorys/Subcategory";
import Edit from "../src/pages/Master/Categorys/Editcategory";
import AddsubCategory from "../src/pages/Master/SubCategorys/Addsubcategory";
import EditSubcategory from "../src/pages/Master/SubCategorys/EditSubcategory";
import News from "../src/pages/Master/News/News";
import AddNews from "../src/pages/Master/News/AddNews";
import EditNews from "../src/pages/Master/News/EditNews";
import NewListVendor from "../src/pages/Master/Vendor/Vendor";
import AddVendor from "../src/pages/Master/Vendor/AddVendor";
import EditVendor from "../src/pages/Master/Vendor/EditVendor";
import VendorUser from "../src/pages/Master/VendorUser/VendorUser";
import AddVendorUser from "../src/pages/Master/VendorUser/AddVendorUser";
import EditVendorUser from "../src/pages/Master/VendorUser/EditVendorUser";
///////////////TRADERS///////////////////////////////
import Live from "../src/pages/Traders/Live/Live";
import EditLive from "../src/pages/Traders/Live/EditLive";

import Rate from "../src/pages/Traders/Rates/Rates";
import EditRate from "../src/pages/Traders/Rates/EditRates";

import SpotRate from "../src/pages/Traders/SpotRate/SpotRates";
import AddSpotRate from "../src/pages/Traders/SpotRate/AddSpotRate";

const App = () => {

  
  return (
    <Router>
      <StatusProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/maintenance" element={<Maintance />} />

          {/* Private Routes */}
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            {/* /////////////////////MASTER///////// */}
            <Route path="/register/category" element={<Category />} />
            <Route path="/register/category/add" element={<Addcategory />} />
            <Route path="/category/edit" element={<Edit />} />
            <Route path="/subcategory" element={<SubCategory />} />
            <Route path="/subcategory/add" element={<AddsubCategory />} />
            <Route path="/subcategory/edit" element={<EditSubcategory />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/add" element={<AddNews />} />
            <Route path="/news/edit" element={<EditNews />} />
            <Route path="/vendor" element={<NewListVendor />} />
            <Route path="/vendor/add" element={<AddVendor />} />
            <Route path="/vendor/edit" element={<EditVendor />} />
            <Route path="/vendoruser" element={<VendorUser />} />
            <Route path="/vendoruser/add" element={<AddVendorUser />} />
            <Route path="/vendoruser/edit" element={<EditVendorUser />} />
            {/* ///////////////////////////////////TRADERS//////////////////////////////////// */}
            <Route path="/traders/live" element={<Live />} />
            <Route path="/traders/live/edit" element={<EditLive />} />
            <Route path="/traders/rates" element={<Rate />} />
            <Route path="/traders/rates/edit" element={<EditRate />} />
            <Route path="/traders/spotrates" element={<SpotRate />} />
            <Route path="/traders/spotrates/add" element={<AddSpotRate />} />
          </Route>

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </StatusProvider>
    </Router>
  );
};

export default App;
