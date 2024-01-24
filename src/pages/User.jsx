import { useEffect, useState,useRef } from "react";
import axios from "axios";
import { MdDeleteOutline, MdRemoveRedEye, MdEdit,MdOutlineChatBubble } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";

import DeleteConfirmationModal from "../components/model/DeleteConfirmationModal";
import Dropdown from "../components/dropdown/Dropdown";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewUser from "../components/model/AddNewUser";
import SortRadio from "../components/radio/SortRadio";
import UserRegistrationForm from "../components/model/UserRegistrationForm";

import Pagnation from "../components/Pagnation/Pagnation";
import { headers } from "../utils/Header";
import { changeUserRoleURl, deleteUrl, getUserDetailsURL, url } from "../api";
import { Link } from "react-router-dom";
import UserDetails from "./UserDetails";

// const getUsersUrl = 'http://localhost:8000/api/v1/auth/getAllUsersDetails'

const perPageOptions = [5, 10, 20, "All"];
const dropdownOptionsGender = ["Male", "Female", "All"];
const dropdownOptionsSort = ["Asc", "Desc"];
const dropdownOptionsRole = ["user", "suspended", "admin"];

const User = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [data, setData] = useState(null);
  const [sortOption, setSortOption] = useState("asc");
  const [filterGender, setFilterGender] = useState("");

  const [dotsOptions, setDotsOptions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isUserDeleted, setUserDeleted] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("");

  const [error, setError] = useState(null);
  const [reset, setReset] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCheckboxChecked, setSortCheckboxChecked] = useState(false);

  const [selectedUserRoleChangeId, setSelectedUserRoleChangeId] =
    useState(null);
  const [isRoleChangeConfirmationOpen, setRoleChangeConfirmationOpen] =
    useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [dropdownKey, setDropdownKey] = useState(0);

  const [perPage, setPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const dotsOptionsRef = useRef(null);




  const fetchData = (search, page, sort, gender, role) => {
    // Dismiss existing toasts
    toast.dismiss();
    axios
      .get(url, {
        headers,
        params: { search, page, limit: perPage, sort, gender, role },
      })
      .then((res) => {
        console.log(res.data);
        const { success, message, response, totalUsers } = res.data;
        if (success || status) {
          setData(response);
          setTotalPages(res.data.totalPages);
          setTotalUsers(totalUsers);
          setError(null);
        } else {
          setData([]);
          setError(`Error: ${message}`);
          // toast.error(`Error: ${message}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("An unexpected error occurred");
        toast.error(error?.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchData(searchQuery, currentPage, sortOrder, filterGender, filterRole)
    
  const handleClickOutside = (event) => {
    if (dotsOptionsRef.current && !dotsOptionsRef.current.contains(event.target)) {
      setDotsOptions(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  
}
  }, [searchQuery, currentPage, sortOrder, filterGender, filterRole,dotsOptionsRef]);

  const handleDelete = async () => {
    axios
      .delete(`${deleteUrl}/${selectedUserId}`, { headers })
      .then((response) => {
        setSelectedUserId(null);
        setConfirmationOpen(false);
        setUserDeleted(true);
        setTimeout(() => {
          setUserDeleted(false);
          window.location.reload();
        }, 3000);
        // const newData =  fetchData()
        // setData(newData);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // const handleChangeUserRole = (selectedOption, userId) => {
  //   const role = selectedOption.toLowerCase();
  //   setSelectedUserRole(role);
  //   setSelectedUserRoleChangeId(userId);
  //   setRoleChangeConfirmationOpen(true);
  // };

  const handleRoleChangeConfirmation = (confirmed) => {
    if (confirmed) {
      axios
        .post(
          changeUserRoleURl,
          { role: selectedUserRole, userId: selectedUserRoleChangeId },
          { headers }
        )
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error changing user role:", error);
        });
    }

    setSelectedUserRoleChangeId(null);
    setRoleChangeConfirmationOpen(false);
  };

  const handleDropdownSelect = (selectedOption) => {
    setCurrentPage(1); // Always set currentPage to 1 when dropdown changes

    switch (selectedOption) {
      case "Asc":
      case "Desc":
        setSortOption(selectedOption.toLowerCase());
        setSearchQuery("");
        setFilterGender("");
        setFilterRole("");
        break;
      case "Male":
      case "Female":
        setFilterGender(selectedOption);
        setSearchQuery("");
        setSortOption("asc");
        setFilterRole("");
        break;
      case "user":
      case "admin":
      case "suspended":
        setSearchQuery("");
        setFilterGender("");
        setSortOption("asc");
        setFilterRole(selectedOption.toLowerCase());
        break;
      default:
        setSearchQuery(selectedOption);
        setFilterGender("");
        setSortOption("asc");
        setFilterRole("");
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = () => {
    // Toggle between 'asc' and 'desc' based on the current sortOrder
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortCheckboxChecked(!sortCheckboxChecked);
  };

  const handleReset = () => {
    setReset(!reset);
    setSearchQuery("");
    setSortOrder("asc");
    setSortCheckboxChecked(false);
    switch (filterRole) {
      case "user":
      case "admin":
      case "suspended":
        setFilterRole("");
        break;
      default:
        setFilterGender("");
        break;
    }
    setCurrentPage(1);
    setDropdownKey((prevKey) => prevKey + 1);
  };

  // Calculate the starting user number for the current page
  const startUserNumber = (currentPage - 1) * 5 + 1;

  const toggleDotsOptions = (userId) => {
    setDotsOptions(dotsOptions === userId ? null : userId);
  };

  return !data ? (
    <h1>Loading data</h1>
  ) : (
    <div className="w-5/6  mx-auto">
      <div className="flex  justify-between my-4">
        <div>
          <button
            onClick={handleReset}
            className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded-md focus:outline-none focus:shadow-outline"
          >
            Reset
          </button>
        </div>
        <div className="bg-[#03C9D7] p-2 rounded-md cursor-pointer text-white font-semibold">
          <AddNewUser />
        </div>
      </div>

      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {/* Fliter Data */}
        <div className="flex justify-between bg-white">
          {/* <div>
            <Dropdown
              label="Gender"
              options={dropdownOptionsGender}
              onSelect={handleDropdownSelect}
            />
          </div> */}
          <div className="w-10">
            <Dropdown
              label="Role"
              options={dropdownOptionsRole}
              onSelect={handleDropdownSelect}
              key={dropdownKey}
            />
          </div>

          <div class="relative flex items-center w-4/12 h-12 rounded-lg focus-within:shadow-sm bg-white overflow-hidden">
            <div class="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              class="peer h-full w-full outline-none text-xs text-gray-700 pr-2"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search something.."
            />
          </div>
        </div>

        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                username
              </th>
              <th scope="col" className="px-6 py-3">
                email
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile Number
              </th>

              <th scope="col" className="px-6 py-3">
                Role
              </th>

              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center ">
                  Oops! No users found matching the search criteria
                </td>
              </tr>
            ) : (
              data.map((result, index) => {
                const {
                  username,
                  role,
                  gender,
                  mobileNumber,
                  avatar,
                  isVerified,
                  email,
                  _id,
                } = result;

                // const handleDeleteClick = () => {
                //   setConfirmationOpen(true);
                //   handleDelete(_id);
                // };

                return (
                  <tr
                    key={_id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 flex items-center gap-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        src={avatar}
                        alt="avatar"
                        className="h-8 w-8 rounded-full "
                      />
                      {username}
                    </th>
                    <td className="px-6 py-4">{email}</td>
                    <td className="px-6 py-4">{mobileNumber}</td>
                    <td className="px-6 py-4">{role}</td>
                    {/* <td className="px-6 py-4">
                      <Dropdown
                        label={role}
                        options={dropdownOptionsRole}
                        onSelect={(selectedOption) => {
                          handleChangeUserRole(selectedOption, _id);
                        }}
                      />
                     
                    </td> */}
                    <td className="px-6 py-4">
                      {isVerified ? "Verified" : "Not Verified"}
                    </td>
                    <td className="px-6 py-4 relative text-xs">
                      {dotsOptions === _id && (
                        <div ref={dotsOptionsRef}  className="absolute bg-white shadow-md rounded-md w-28  top-1 right-[5rem]">
                          <button
                            class=" text-red-700  flex items-center justify-center gap-2 font-bold py-1 px-2 "
                            onClick={() => {
                              setSelectedUserId(_id);
                              setConfirmationOpen(true);
                            }}
                          >
                            <MdDeleteOutline size={15} />{" "}
                            <span className=" font-light">Delete</span>
                          </button>

                          <Link to={`/userDetails/${_id}`}>
                            <button class=" text-gray-700 flex items-center gap-2 font-bold py-1 px-2 ">
                              <MdRemoveRedEye size={15} />{" "}
                              <span className=" font-light">View</span>
                            </button>
                          </Link>

                          <Link to={`/updateUserDetails/${_id}`}>
                            <button class=" text-gray-700 flex items-center gap-2 font-bold py-1 px-2 ">
                              <MdEdit size={15} />{" "}
                              <span className="font-light">Edit</span>
                            </button>
                          </Link>

                          <Link to={`/chat/${_id}`}>
                            <button class=" text-gray-700 flex items-center gap-2 font-bold py-1 px-2 ">
                              <MdOutlineChatBubble size={15} />{" "}
                              <span className="font-light">Chat</span>
                            </button>
                          </Link>
                        </div>
                      )}

                      {/* Dots  */}
                      <button
                        className="text-gray-500 text-2xl"
                        onClick={() => toggleDotsOptions(_id)}
                      >
                        <BiDotsVerticalRounded />
                      </button>

                      {isConfirmationOpen && (
                        <div className="fixed inset-0  bg-black bg-opacity-10 flex items-center justify-center">
                          <div className="bg-white p-4 w-80 rounded shadow">
                            <p>Are you sure you want to delete this user? </p>
                            <div className="flex justify-end mt-2">
                              <button
                                className="mr-2 px-4 py-1 bg-red-500 text-white rounded"
                                onClick={() => setConfirmationOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-4 py-1 bg-green-500 text-white rounded"
                                onClick={() => handleDelete()}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {selectedUserRoleChangeId && isRoleChangeConfirmationOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow">
              <p>Are you sure you want to change this user's role?</p>
              <div className="flex justify-end mt-2">
                <button
                  className="mr-2 px-4 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleRoleChangeConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleRoleChangeConfirmation(true)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User deleted success message */}
        {isUserDeleted && toast.success("User deleted successfully!")}
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
          aria-label="Table navigation"
        >
          <div className="">
            <label className="flex gap-1 ml-4">
              <input
                type="checkbox"
                size={32}
                checked={sortOrder === "desc"}
                onChange={handleCheckboxChange}
              />
              <p>Sort</p>
            </label>
            {/* <div>
              <label className="mr-2">Show:</label>
              <Select
                options={perPageOptions.map((value) => ({
                  value,
                  label: value === "All" ? "All" : `${value} per page`,
                }))}
                value={{
                  value: perPage,
                  label: perPage === "All" ? "All" : `${perPage} per page`,
                }}
                onChange={(selectedOption) => setPerPage(selectedOption.value)}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Showing {startUserNumber} - {startUserNumber + data.length - 1} of{" "}
              {totalUsers} users
            </p> */}
          </div>

          <Pagnation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </nav>
      </div>
    </div>
  );
};

export default User;
