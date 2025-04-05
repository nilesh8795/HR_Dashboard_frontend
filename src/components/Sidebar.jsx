import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigate
import {
  FaUsers,
  FaClipboardList,
  FaUserClock,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ setActivePage }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-6">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-2 border-purple-700"></div>
        <h2 className="text-lg font-bold text-purple-700">HR Dashboard</h2>
      </div>
      <nav className="mt-6">
        <h3 className="text-gray-500 text-sm uppercase">Recruitment</h3>
        <ul className="space-y-2 mt-2">
          <li
            className="flex items-center text-purple-700 font-semibold cursor-pointer"
            onClick={() => setActivePage("Candidates")}
          >
            <FaUsers className="mr-2" /> Candidates
          </li>
        </ul>

        <h3 className="text-gray-500 text-sm uppercase mt-6">Organization</h3>
        <ul className="space-y-2 mt-2">
          <li
            className="flex items-center text-gray-700 cursor-pointer"
            onClick={() => setActivePage("Employees")}
          >
            <FaClipboardList className="mr-2" /> Employees
          </li>
          <li
            className="flex items-center text-gray-700 cursor-pointer"
            onClick={() => setActivePage("Attendance")}
          >
            <FaUserClock className="mr-2" /> Attendance
          </li>
          <li
            className="flex items-center text-gray-700 cursor-pointer"
            onClick={() => setActivePage("Leaves")}
          >
            <FaUserClock className="mr-2" /> Leaves
          </li>
        </ul>

        <h3 className="text-gray-500 text-sm uppercase mt-6">Others</h3>
        <ul className="space-y-2 mt-2">
          <li
            className="flex items-center text-red-600 cursor-pointer"
            onClick={handleLogout} // Attach the logout handler
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
