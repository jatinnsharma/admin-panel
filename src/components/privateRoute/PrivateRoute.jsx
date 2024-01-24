// components/privateRoute/PrivateRoute.jsx
import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  console.log('check',isLoggedIn)
  const navigate = useNavigate()
  if (!isLoggedIn) {
    // Redirect to the login page if the user is not logged in
    return navigate('/login');
  }

  // Render the protected component if the user is logged in
  return element;
};

export default PrivateRoute;
