import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import mainLogo from "../../assets/kmrlive.png"; // Ensure the path is correct
import { toast } from "sonner";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = () => {
    const data = {
      username: username,
      email: email,
    };

    if (email !== "" && username !== "") {
      axios({
        url: `https://kmrlive.in/public/api/panel-send-password?username=${username}&email=${email}`,
        method: "POST",
        data: data,
      })
        .then((res) => {
          if (res.data.code == 200) {
            toast.success("New Password Sent to your Email");
           
              navigate("/signin");
          
          } else {
            toast.error("This email is not registered with us.");
          }
        })
        .catch((error) => {
          toast.error("Email Not Sent.");
        });
    } else {
      toast.warn("Please enter a User Name & Email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={mainLogo} alt="Main Logo" className=" h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Reset Password
        </h2>

        {/* Form */}
        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Name
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter User Name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter Email Address"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            onClick={onResetPassword}
            className="w-full py-3 px-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
          >
            Reset Password
          </button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-accent-500 hover:text-accent-600"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      
    </div>
  );
};

export default ForgetPassword;