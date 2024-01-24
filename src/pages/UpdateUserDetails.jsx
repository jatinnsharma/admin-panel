import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateUserDetailsURL, getUserDetailsURL } from "../api";
import { headers } from "../utils/Header";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

const UpdateUserDetails = () => {
  const [user, setUser] = useState({
    avatar: "",
    username: "",
    email: "",
    mobileNumber: "",
    address: "",
    hobbies: "",
    gender: "",
    aadharCard: "",
    permanentAddress: "",
    currentAddress: "",
    isVerified: "",
    _id:"",
    role:""
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    console.log(e.target)
    if ((name === "aadharCard" || name === "avatar") && type === "file") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: e.target.files[0],
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const { userId } = useParams();

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${getUserDetailsURL}/${userId}`, { headers });
      console.log(response?.data?.response[0].user);
      if (response.status === 200) {
        setUser({
          ...user,
          ...response?.data?.response[0]?.user,
        });
      } else {
        // Handle error
        console.error("Failed to fetch user profile data");
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleReload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("address", user.address);
      formData.append("mobileNumber", user.mobileNumber);
      formData.append("hobbies", user.hobbies);
      formData.append("gender", user.gender);
      formData.append("aadharCard", user.aadharCard);
      formData.append("avatar", user.avatar);
      formData.append("permanentAddress", user.permanentAddress);
      formData.append("currentAddress", user.currentAddress);
      formData.append("isVerified", user.isVerified);
      formData.append("_id", user._id);
      formData.append("role",user.role)

      const response = await axios.patch(`${updateUserDetailsURL}/${userId}`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("User profile updated successfully");
        handleReload();
      } else {
        console.error("Failed to update user profile");
        toast.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(
        error?.response?.data?.message || "Error updating user profile"
      );
    }
  };

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId]);

return (
    <div className="bg-gray-100">
      <ToastContainer/>
      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div
              className={`p-3 border-t-4 ${
                user.isVerified
                  ? "border-green-400 bg-green-50"
                  : "border-red-400 bg-red-50"
              }`}
            >
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {user.username}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                Owner at Company Inc.
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, eligendi dolorum sequi illum qui unde
                aspernatur non deserunt
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Status</span>
                  <span className="ml-auto">
                    <span
                      className={`py-1 px-2 rounded text-white text-sm ${
                        user.isVerified ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.isVerified ? "Active" : "Not Active"}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <section className="py-1 bg-blueGray-50">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      Edit User Details
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form onSubmit={handleSubmit}>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      User Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="userId"
                          >
                            User Id
                          </label>
                          <input
                            type="text"
                            disabled
                            value={user._id}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="email"
                          >
                            Email address
                          </label>
                          <input
                          type="email"
                          id="email"
                          name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="mobileNumber"
                          >
                            Contact No.
                          </label>
                          <input
                            type="text"
                            value={user.mobileNumber}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="hobbies"
                          >
                            Hobbies
                          </label>
                          <input
                            type="text"
                            name="hobbies"
                            value={user.hobbies}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="aadharCard"
                          >
                            Aadhar Card (PDF)
                          </label>
                          {/* Add input for Aadhar Card (PDF) */}
                          <input
                            type="file"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="role"
                          >
                            Role
                          </label>
                          <select
                            name="role"
                            value={user.role}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>

                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="gender"
                          >
                            Gender
                          </label>
                          <div className="flex">
                            <label className="mr-4">
                              <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={user.gender === "Male"}
                                onChange={handleInputChange}
                              />
                              <span className="ml-2">Male</span>
                            </label>
                            <label className="mr-4">
                              <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={user.gender === "Female"}
                                onChange={handleInputChange}
                              />
                              <span className="ml-2">Female</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={user.gender === "Other"}
                                onChange={handleInputChange}
                              />
                              <span className="ml-2">Other</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    
                    </div>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Contact Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="currentAddress"
                          >
                            Current Address
                          </label>
                          <input
                            type="text"
                            name="currentAddress"
                            value={user.currentAddress}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="permanentAddress"
                          >
                            Permanent Address
                          </label>
                          <input
                            type="text"
                            name="permanentAddress"
                            value={user.permanentAddress}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 mt-5 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserDetails;
