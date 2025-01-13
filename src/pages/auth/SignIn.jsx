import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";
import siginLogo from "../../assets/kmrlive.png";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .min(2, "Password should be of minimum 2 characters length")
      .required("Password is required"),
  });


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://kmrlive.in/public/api/panel-login",
          {
            username: values.email,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        console.log("API Response:", data);

        if (response.status == 200 && data.UserInfo && data.UserInfo.token) {
          localStorage.setItem("token", data.UserInfo.token);
          localStorage.setItem("username", data.UserInfo.user.name);

          const storedToken = localStorage.getItem("token");
          console.log("Stored Token:", storedToken);

          if (storedToken == data.UserInfo.token) {
            navigate("/home");
            toast.success("Login Successful.");
          } else {
            toast.error("Check the username and password.");
          }
        } else {
          console.error("Error:", data.msg || "No token returned in response.");
          toast.error("Login failed. Username and password are incorrect.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false); // End loading
      }
    },
  });


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-accent-500 to-accent-600 relative">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-center">
            Manage your spice, oil, and seed inventory effortlessly with our
            CRM.
          </p>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <img
          src="https://images.immediate.co.uk/production/volatile/sites/30/2024/10/Soybean-oil-4695c4f.jpg?quality=90&resize=440,400"
          alt="SignIn Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2  flex flex-col justify-center items-center p-4 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={siginLogo} // Replace with your logo URL
              alt="Logo"
              className=" w-full h-20"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Welcome Back, Sign In
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div   className="flex items-center">
                <Checkbox   tabIndex={-1} id="rememberMe" name="rememberMe" color="primary" />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700"
                >
                  Remember Me
                </label>
              </div>
              <Link
                tabIndex={-1}
                to="/forget-password"
                className="text-sm text-accent-500 hover:text-accent-600"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
