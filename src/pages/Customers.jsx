import { useEffect, useState } from "react";
import axios from "axios";

// const getUsersUrl = 'http://localhost:8000/api/v1/auth/getAllUsersDetails'
const deleteUrl = "http://localhost:8000/api/v1/delete-user";
const url = "http://localhost:8000/api/v1/filter-user";
const changeUserRoleURl = "http://localhost:8000/api/v1/upgradeRole";

const dropdownOptionsGender = ["Male", "Female"];
const dropdownOptionsSort = ["Asc", "Desc"];
const dropdownOptionsRole = ["user", "suspended", "admin"];

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { customersData, customersGrid } from "../data/dummy";
import { Header } from "../components";
import AddNewUser from "../components/model/AddNewUser";
// import AddNewUser from "../components/model/AddNewUser";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [data, setData] = useState(null);
  const [sortOption, setSortOption] = useState("asc");
  const [filterGender, setFilterGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);



  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWQxODdiNTAzMDg3ZmYzNDE0ZDRkOSIsImlhdCI6MTcwNTAzNjI3OCwiZXhwIjoxNzA1MTIyNjc4fQ.v4ewCqgbDitQam4koCT7gUVMd3s5JXdg1jve1Da4HoQ",
  };

  const fetchData = (search, page, sort, gender) => {
    axios
      .get(url, {
        headers,
        params: { search, page, limit: "", sort, gender },
      })
      .then((res) => {
        setData(res.data.response);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(searchQuery, currentPage, sortOption, filterGender);
  }, [searchQuery, currentPage, sortOption, filterGender]);

  const handleDelete = (userId) => {
    console.log("hel;lo",userId)
    axios
      .delete(`${deleteUrl}/${userId}`, { headers })
      .then((response) => {
        // window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleChangeUserRole = (selectedOption, username) => {
    const role = selectedOption.toLowerCase();

    axios
      .post(changeUserRoleURl, { role: role, username: username }, { headers })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleDropdownSelect = (selectedOption) => {
    if (selectedOption === "Asc" || selectedOption === "Desc") {
      setSortOption(selectedOption.toLowerCase());
      setSearchQuery("");
      setFilterGender("");
    } else if (selectedOption === "Male" || selectedOption === "Female") {
      setFilterGender(selectedOption);
      setSearchQuery("");
      setSortOption("asc");
    } else {
      setSearchQuery(selectedOption);
      setFilterGender("");
      setSortOption("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the starting user number for the current page
  const startUserNumber = (currentPage - 1) * 5 + 1;

  console.log(data)

  return !data ? (
    <h1>"Loading data" </h1>
  ) : (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex items-center justify-between">
        <Header category="Page" title="Customers" />
        <div className="bg-[#03C9D7] p-2 rounded-md cursor-pointer text-white font-semibold">
          <AddNewUser />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>

        <button className="border p-1 px-2" onClick={() => setConfirmationOpen(true)}>
          Delete
        </button>
        {isConfirmationOpen && (
        <div className="z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-2">
              <button
                className="mr-2 px-4 py-1 bg-red-500 text-white rounded"
                onClick={() => setConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-green-500 text-white rounded"
                onClick={()=>handleDelete(data._id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
        </div>



        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          class="border  focus:focus:outline-none w-2/6 h-8 mb-1 "
          placeholder="Search"
          aria-label="Search"
          aria-describedby="button-addon2"
        />
      </div>
      <GridComponent
        dataSource={data}
        allowPaging
        allowSorting
        editSettings={{ allowDeleting: true, allowEditing: true }}
        width="auto"
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
