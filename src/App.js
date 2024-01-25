import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "./contexts/ContextProvider";

import User from "./pages/User.jsx";
import io from 'socket.io-client'; 

import Login from "./components/auth/login/Login";
import ForgotPassword from "./components/auth/forgotPassword/ForgotPassword";
import ResetPassword from "./components/auth/forgotPassword/ResetPassword";
import Profile from "./pages/Profile";
import ChangePassword from "./components/auth/changePassword/ChangePassword";

import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header/Header";
import Chat from "./components/chat/Chat";
import {   Navbar, Sidebar, ThemeSettings } from "./components";
import {
  Ecommerce,
  Orders,
  Calendar,
  Employees,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Area,
  Bar,
  Pie,
  Financial,
  ColorMapping,
  ColorPicker,
  Editor,
  Line,
} from "./pages";
import { useAuth } from "./contexts/AuthContext";
import { PrivateRoute } from "./utils/PrivateRoute.js";
import UserDetails from "./pages/UserDetails.jsx";
import UpdateUserDetails from "./pages/UpdateUserDetails.jsx";
import UserChat from "./components/chat/UserChat/UserChat.jsx";


const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();

  const { isLoggedIn } = useAuth();

  const [username, setUsername] = useState(''); // Add this
  const [room, setRoom] = useState(''); 

  const shouldShowSidebar = () => {
    const currentPath = window.location.pathname;
    const excludedPaths = [
      "/login",
      "/forgot-password",
      "/api/v1/auth/reset-password/",
      "/userchat/"
    ];
    return (
      activeMenu && !excludedPaths.some((path) => currentPath.includes(path))
    );
  };

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "10" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: "50%" }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>

        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
          {shouldShowSidebar() && <Sidebar />}
        </div>
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? "md:ml-72" : "flex-2"
          }`}
        >
          {isLoggedIn && <Header />}
          <Routes>
            {/* {isLoggedIn && <Route path="/" element={<Header />} />} */}
            {/* 
            {isLoggedIn ? (
          <> */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Ecommerce />
                </PrivateRoute>
              }
            />
            {isLoggedIn && (
              <>
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/forgot-password" element={<Navigate to="/" />} />
              </>
            )}
            {/* Dashboard */}
            <Route
              path="/ecommerce"
              element={
                <PrivateRoute>
                  <Ecommerce />
                </PrivateRoute>
              }
            />

            {/* Pages */}
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <Employees />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
            <Route
              path="/adminProfile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/userDetails/:userId"
              element={
                <PrivateRoute>
                  <UserDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/updateUserDetails/:userId"
              element={
                <PrivateRoute>
                  <UpdateUserDetails />
                </PrivateRoute>
              }
            />

            {/* Apps */}
            <Route
              path="/kanban"
              element={
                <PrivateRoute>
                  <Kanban />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/color-picker"
              element={
                <PrivateRoute>
                  <ColorPicker />
                </PrivateRoute>
              }
            />

            {/* Charts */}
            <Route
              path="/line"
              element={
                <PrivateRoute>
                  <Line />
                </PrivateRoute>
              }
            />
            <Route
              path="/area"
              element={
                <PrivateRoute>
                  <Area />
                </PrivateRoute>
              }
            />
            <Route
              path="/bar"
              element={
                <PrivateRoute>
                  <Bar />
                </PrivateRoute>
              }
            />
            <Route
              path="/pie"
              element={
                <PrivateRoute>
                  <Pie />
                </PrivateRoute>
              }
            />
            <Route
              path="/financial"
              element={
                <PrivateRoute>
                  <Financial />
                </PrivateRoute>
              }
            />
            <Route
              path="/color-mapping"
              element={
                <PrivateRoute>
                  <ColorMapping />
                </PrivateRoute>
              }
            />
            <Route
              path="/pyramid"
              element={
                <PrivateRoute>
                  <Pyramid />
                </PrivateRoute>
              }
            />
            <Route
              path="/stacked"
              element={
                <PrivateRoute>
                  <Stacked />
                </PrivateRoute>
              }
            />
            <Route
              path="/changePassword"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:userId"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/userchat/:userId"
              element={
                  <UserChat />
              }
            />
           

            <Route path="*" element={<h1></h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/api/v1/auth/reset-password/:resetToken"
              element={<ResetPassword />}
            />
          </Routes>

          {themeSettings && <ThemeSettings />}
        </div>
      </div>
    </div>
  );
};

export default App;
