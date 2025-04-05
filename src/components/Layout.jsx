import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Candidates from "./pages/Candidates";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";

const Layout = () => {
  const [activePage, setActivePage] = useState("Candidates");

  const renderPage = () => {
    switch (activePage) {
      case "Candidates":
        return <Candidates />;
      case "Employees":
        return <Employees />;
      case "Attendance":
        return <Attendance />;
      case "Leaves":
        return <Leaves />;
      default:
        return <Candidates />;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1">
        <Navbar heading={activePage} />
        <div className="bg-gray-100 min-h-screen">{renderPage()}</div>
      </div>
    </div>
  );
};

export default Layout;
