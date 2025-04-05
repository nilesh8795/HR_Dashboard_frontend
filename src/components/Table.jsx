import React from "react";

const Table = () => {
  return (
    <div className="p-6">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-purple-800 text-white">
            <th className="p-3 text-left">Sr no.</th>
            <th className="p-3 text-left">Candidates Name</th>
            <th className="p-3 text-left">Email Address</th>
            <th className="p-3 text-left">Phone Number</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Experience</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border">1</td>
            <td className="p-3 border">John Doe</td>
            <td className="p-3 border">john@example.com</td>
            <td className="p-3 border">+1234567890</td>
            <td className="p-3 border">Software Engineer</td>
            <td className="p-3 border">Pending</td>
            <td className="p-3 border">3 years</td>
            <td className="p-3 border text-blue-500 cursor-pointer">Edit | Delete</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
