import React, { useEffect, useState } from "react";
import { getCandidates, createLeave, getLeaves, updateLeaveStatus, deleteLeave } from "../../services/api.js";

import { showSuccess, showError, showConfirm } from "../../helpers/Swalfire.js"; // ✅ Import custom Swal helpers

const LEAVE_STATUS = ["Pending", "Approved", "Rejected"];
const LEAVE_TYPE = ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave"];

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [hiredCandidates, setHiredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchHiredCandidates();
    fetchLeaves();
  }, [showModal]);

  const fetchHiredCandidates = async () => {
    setLoading(true);
    try {
      const res = await getCandidates();
      const hired = res.filter((candidate) => candidate.status === "Hired");
      setHiredCandidates(hired);
    } catch (err) {
      console.error("Failed to fetch hired employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await getLeaves();
      setLeaves(res);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const selectedCandidate = hiredCandidates.find(c => c.name === value);
      setFormData((prev) => ({
        ...prev,
        name: value,
        position: selectedCandidate?.position || ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createLeave(formData);
      setLeaves((prev) => [...prev, { ...res }]);
      setFormData({
        name: "",
        position: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "Pending",
      });
      setShowModal(false);
  
      // Show success message after creating leave
      showSuccess("Leave has been successfully added.");
    } catch (error) {
      console.error("Error saving leave:", error);
      showError("There was an error saving the leave.");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteLeave(id);
      setLeaves((prev) => prev.filter((leave) => leave._id !== id));
      showSuccess("Leave has been successfully deleted.");
    } catch (error) {
      showError("There was an error deleting the leave.");
    }
  };
  

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, { status: newStatus });
      setLeaves((prev) => 
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchType = typeFilter === "All" || l.leaveType === typeFilter;
    const matchSearch = l.name?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 shadow-md rounded-lg">
        <div className="flex space-x-4">
          <select
            className="border px-4 py-2 rounded-full bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {LEAVE_STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-full bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            {LEAVE_TYPE.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-full px-4 py-2 w-1/3"
        />

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Add Leave
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-700 text-white">
              <th className="p-3">#</th>
              <th className="p-3">Employee</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((l, i) => (
              <tr key={l._id} className="border-b text-center">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{l.name}</td>
                <td className="p-3">
                  {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                </td>
                <td className="p-3">{l.reason}</td>
                <td className="p-3">
                  <select
                    className="border px-3 py-1 rounded-full"
                    value={l.status}
                    onChange={(e) => handleStatusChange(l._id, e.target.value)}
                  >
                    {LEAVE_STATUS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-lg animate-fadeIn">
            <div className="bg-purple-700 text-white py-4 px-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Leave</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-400"
              >
                &times;
              </button>
            </div>

            {/* Leave Form */}
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="flex space-x-4">
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                >
                  <option value="">Select Employee</option>
                  {hiredCandidates.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Leave Reason"
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-purple-700 text-white py-3 px-8 rounded-lg"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 py-3 px-8 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
