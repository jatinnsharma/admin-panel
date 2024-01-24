import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import axios from 'axios';

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { headers } from '../../utils/Header';

const url = 'http://localhost:8000/api/v1/add-new-user';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height:300,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const AddNewUser = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = React.useState({
    email: '',
    username: '',
    password: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = React.useState({
    email: '',
    username: '',
    password: '',
    mobileNumber: '',
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
      case 'email':
        const emailRegex = /^\S+@\S+\.\S+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: emailRegex.test(value) ? '' : 'Invalid email address',
        }));
        break;
      case 'username':
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: value.length >= 3 ? '' : 'Username must be at least 3 characters long',
        }));
        break;
      case 'password':
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: value.length >= 8 ? '' : 'Password must be at least 8 characters long',
        }));
        break;
      case 'mobileNumber':
        const numericRegex = /^\d+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobileNumber: numericRegex.test(value) && value.length >= 10 ? '' : 'Invalid mobile number',
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if there are any validation errors
      if (Object.values(errors).some((error) => error !== '')) {
        console.error('Form has validation errors');
        return;
      }
      // console.log('Form Data:', formData);
      
      const response = await axios.post(url, formData, { headers });
      if (response.status === 201) {
        clearForm();
        handleClose();
        toast.success('User added successfully!', {
          onClose: () => handleClose(), 
        });
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error('Error submitting form:', error);
    }
  };

  const clearForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      mobileNumber: '',
    });
    setErrors({
      email: '',
      username: '',
      password: '',
      mobileNumber: '',
    });
  };

  return (
    <>
      <button onClick={handleOpen} >Add New User</button>
      <ToastContainer position="top-right" autoClose={5000} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, outline: 'none' }}>

            <div className="flex justify-center items-center  ">
              <form onSubmit={handleSubmit} className=" items-center justify-center grid grid-cols-2 gap-5 " method="POST">
               
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleChange}
                      value={formData.email}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      requiredonSubmit={handleSubmit}
                      className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 placeholder:text-gray-400 focus:outline-none pl-2"
                    />
                    {errors.email && <p className="error text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      onChange={handleChange}
                      value={formData.username}
                      type="text"
                      autoComplete="username"
                      placeholder="Enter username"
                      
                      className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 placeholder:text-gray-400  focus:outline-none pl-2"
                    />
                    {errors.username && <p className="error text-red-500">{errors.username}</p>}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      value={formData.password}
                      autoComplete="current-password"
                
                      className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 placeholder:text-gray-400  focus:outline-none pl-2"
                    />
                    {errors.password && <p className="error text-red-500">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="text"
                      autoComplete="tel"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter mobile Number"
                      className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 placeholder:text-gray-400  focus:outline-none pl-2"
                    />
                    {errors.mobileNumber && <p className="error text-red-500">{errors.mobileNumber}</p>}
                  </div>
                </div>

             

                <div className="">
                  <button
                    type="submit"
                    disabled={Object.values(errors).some((error) => error !== '')}
                    className=" rounded-md bg-[#03c9d7] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                  >
                    Add New User
                  </button>
                </div>
              </form>
            </div>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewUser;
