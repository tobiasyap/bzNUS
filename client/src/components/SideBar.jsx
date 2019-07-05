import React from "react";
import Sidebar from "react-sidebar";

const SideBar = ({ location, children, ...rest }) => {
  return (
    <Sidebar
      docked={
        !(location.pathname.match("/login") || location.pathname.match("/404"))
      }
      {...rest}
    >
      {children}
    </Sidebar>
  );
};

export default SideBar;
