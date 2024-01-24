import React, { useState } from "react";
import { changePasswordUrl } from "../../../api";
import axios from "axios";
import { headers } from "../../../utils/Header";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";


const ChangePassword = () => {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    switch (name) {
      case "currentPassword":
      case "newPassword":
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]:
            value.length >= 8
              ? ""
              : `${
                  name.charAt(0).toUpperCase() + name.slice(1)
                } must be at least 8 characters long`,
        }));
        break;
      case "confirmPassword":
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            value === passwords.newPassword ? "" : "Passwords do not match",
        }));
        break;
      default:
        break;
    }
  };

  const changePasssword = async (req, res) => {
    try {
      const response = await axios.patch(
        changePasswordUrl,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { headers }
      );
      clearForm();
      navigate('/login')
      toast.success(`Password change successfully`);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!errors.currentPassword && !errors.newPassword && !errors.confirmPassword) {   
         changePasssword();
    } else {
      console.error("Form has validation errors");
    }
  };

  const clearForm = () => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

   const togglePasswordVisibility = (field) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-md  w-3/6 mx-auto flex justify-center items-center flex-col ">
          <div className="mb-4 mt-10 ">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="currentPassword"
            >
              Current Password:
            </label>
            <input
              type={showPassword.currentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handleInputChange}
              className="border p-2 w-[22vw]"
            />
            <div>

            {errors.currentPassword && (
              <p className="text-red-500 text-xs">*{errors.currentPassword}</p>
            )}
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="text-gray-500 text-xs dark:text-gray-300 focus:outline-none"
            >
              {showPassword.currentPassword ? "Hide" : "Show"} Password
            </button>
            </div>
          </div>
              
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password:
            </label>
            <input
              type={showPassword.newPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handleInputChange}
              className="border p-2 w-[22vw]"
            />
            <div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs">*{errors.newPassword}</p>
            )}
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="text-gray-500 dark:text-gray-300 text-xs focus:outline-none"
            >
              {showPassword.newPassword ? "Hide" : "Show"} Password
            </button>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password:
            </label>
            <input
               type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              className="border p-2 w-[22vw]"
            />
            <div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">*{errors.confirmPassword}</p>
            )}
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="text-gray-500 dark:text-gray-300 text-xs focus:outline-none"
            >
              {showPassword.confirmPassword ? "Hide" : "Show"} Password
            </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#03c9d7] w-[22vw] mb-10 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
