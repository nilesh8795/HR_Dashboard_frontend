import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getProfile } from "../services/api";

const Navbar = ({ heading, userId }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await getProfile(userId);
        if (res) {
          setUserName(res.data.name); 
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId]);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{heading}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaUserCircle className="text-gray-700 text-3xl" />
            <span className="text-gray-800 font-medium">
              {userName || "User"} {/* Display dynamic name or default "User" */}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
