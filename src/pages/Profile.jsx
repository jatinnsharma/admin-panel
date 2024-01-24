import React, { useState, useEffect } from "react";
import { updateProfileUrl, getOwnDetailsUrl } from "../api";
import { headers } from "../utils/Header";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import ProfileImageModel from "../components/profileImageModel/ProfileImageModel";

const Profile = () => {
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
  });


  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const [loading, setLoading] = useState(false); 

  const fetchUserProfile = async (req, res) => {
    try {
      const response = await axios.get(getOwnDetailsUrl, { headers });
      console.log(response?.data?.response[0]?.user);
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

  console.log(user.avatar)
  const handleReload = ()=>{
    const id = setTimeout(()=>{
      window.location.reload();
    },3000)

    setTimeoutId(id);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("address", user.address);
      formData.append("mobileNumber", user.mobileNumber);
      formData.append("hobbies", user.hobbies);
      formData.append("gender", user.gender);
      formData.append("aadharCard", user.aadharCard);
      formData.append("avatar", user.avatar);
      formData.append("permanentAddress", user.permanentAddress);
      formData.append("currentAddress", user.currentAddress);
      
      const response = await axios.patch(
        updateProfileUrl,
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
  
      if (response.status === 200) {
        toast.success("User profile updated successfully");
        handleReload()
      } else {
        console.error("Failed to update user profile");
        toast.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(
        error?.response?.data?.message || "Error updating user profile"
      );
    }finally {
      setLoading(false)
    }

    return ()=>{
      if(timeoutId)
      clearTimeout(timeoutId);
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAvatarClick = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  const handleViewProfile = () => {
    setModalImageUrl(user.avatar);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md w-5/6">
      <h1 className="text-2xl font-semibold mb-4">Admin Details</h1>
      <ToastContainer />

      <div className="mb-4 flex items-center">
        <div onClick={handleAvatarClick} className="cursor-pointer">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mb-2 hover:opacity-80 transition-opacity"
          />
        </div>

        {showProfileOptions && (
          <div className="ml-4">
            <p
              className="text-blue-500 cursor-pointer"
              onClick={handleViewProfile}
            >
              View Profile
            </p>
            <input
              type="file"
              name="avatar"
              onChange={handleInputChange}
              className="text-xs p-2 cursor-pointer"
            />
          </div>
        )}
        <ProfileImageModel isOpen={isModalOpen} closeModal={closeModal} imageUrl={modalImageUrl} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 justify-center items-center"
      >
        <div className="mb-4 ">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            disabled
            className="border p-2 w-[20vw] "
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            disabled
            className="border p-2 w-[20vw]"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="mobileNumber"
          >
            Mobile Number:
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={user.mobileNumber}
            onChange={handleInputChange}
            disabled
            className="border p-2 w-[20vw]"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="hobbies"
          >
            Hobbies:
          </label>
          <textarea
            id="hobbies"
            name="hobbies"
            value={user.hobbies}
            onChange={handleInputChange}
            className="border p-2 w-[20vw]"
          ></textarea>
        </div>

        {/* Gender Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="gender"
          >
            Gender:
          </label>
          <select
            id="gender"
            name="gender"
            value={user.gender}
            onChange={handleInputChange}
            className="border p-2 "
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="aadharCard"
          >
            Aadhar Card (PDF) :
          </label>
          <input
            type="file"
            accept=".pdf"
            name="aadharCard"
            onChange={handleInputChange}
            className="text-xs p-2 cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="permanentAddress"
          >
            Permanent Address:
          </label>
          <input
            type="text"
            id="permanentAddress"
            name="permanentAddress"
            value={user.permanentAddress}
            onChange={handleInputChange}
            className="border p-2 w-[20vw]"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="currentAddress"
          >
            Current Address:
          </label>
          <input
            type="text"
            id="currentAddress"
            name="currentAddress"
            value={user.currentAddress}
            onChange={handleInputChange}
            className="border p-2 w-[20vw]"
          />
        </div>

       
        <button
          type="submit"
          className={`bg-[#03c9d7] h-10 w-5/6 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
