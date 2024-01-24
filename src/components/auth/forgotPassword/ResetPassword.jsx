import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate, useParams } from "react-router";


const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { resetToken } = useParams();
  

  console.log("reset token",resetToken);
  useEffect(() => {
    console.log("Reset Token:", resetToken);
  }, [resetToken]);

  const [formData, setFormData] = React.useState({
    password: "",
  });
  const [errors, setErrors] = React.useState({
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validateInput(e.target.name, e.target.value);
  };

  const validateInput = (name, value) => {
    switch (name) {
      case "password":
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            value.length >= 8
              ? ""
              : "Password must be at least 8 characters long ",
        }));
        break;
      default:
        break;
    }
  };

  const resetPassword = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/auth/reset-password/${resetToken}`,
        { password: formData.password },
 
      );

      if (response.status === 200) {
        clearForm();
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error?.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!errors.password) {
      resetPassword();
    } else {
      console.error("Form has validation errors");
    }
  };

  const clearForm = () => {
    setFormData({
      password: "",
    });
    setErrors({
      password: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <section className="bg-white w-5/6 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-gray-200 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset Password
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handleChange}
                    value={formData.password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter New Password "
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 dark:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"} Password
                  </button>
                  {errors.email && (
                    <p className="error text-red-500">{errors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white  bg-[#03c9d7] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
