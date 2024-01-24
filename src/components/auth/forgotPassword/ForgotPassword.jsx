import React from 'react'
import axios from 'axios';

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { headers } from '../../../utils/Header';
import { forgortPasswordUrl } from '../../../api';



const ForgotPassword = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
      email: "",
    });
    const [errors, setErrors] = React.useState({
      email: "",
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
        default:
          break;
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // Check if there are any validation errors
        if (Object.values(errors).some((error) => error !== "")) {
          console.error("Form has validation errors");
          return;
        }
  
        const response = await axios.post(forgortPasswordUrl, formData,headers );
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          clearForm();
          // handleClose();
          toast.success(`Password reset link sent to ${formData.email} successfully!`);
          
        } else {
          toast.error(response.data.message || 'Error resetting password.');
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
      }
    };
    const clearForm = () => {
      setFormData({
        email: "",
      });
      setErrors({
        email: "",
      });
    };
  return (
    <>
          <ToastContainer position="top-right" autoClose={5000} />

        <section className="bg-white dark:bg-gray-900 ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-gray-200 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Password
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
                    Enter your email 
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Your email "
                  />
                  {errors.email && (
                    <p className="error text-red-500">{errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white  bg-[#03c9d7] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Get a link
                </button>
                
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPassword