// OuterLayout.jsx
import React from "react";
import SideBar from "../Sidebar";
import Header from "../header/Header";
const OuterLayout = ({ children }) => (
  <>
    <Header />
    <SideBar />
    {children}
  </>
);

export default OuterLayout;
