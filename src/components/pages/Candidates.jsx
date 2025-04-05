import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import {
  createCandidate,
  getCandidates,
  updateCandidateStatus,
} from "../../services/api.js";
import { showSuccess, showError } from "../../helpers/Swalfire.js";

const STATUS_OPTIONS = ["Pending", "Scheduled", "Rejected", "Hired"];
const POSITION_OPTIONS = [
  "Intern",
  "Junior Developer",
  "Mid-Level Developer",
  "Senior Developer",
  "Team Lead",
  "Engineering Manager",
  "CTO",
];

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Added state to track saving status

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "Pending",
    experience: 0,
    resume: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCandidates();
      setCandidates(res);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Set saving status to true when the form is being submitted
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    try {
      await createCandidate(submissionData);
      setShowModal(false);
      fetchData();
      showSuccess('Candidate Added!', 'The candidate has been successfully added.');
    } catch (error) {
      console.error("Error creating candidate:", error);
      showError('Oops...', 'Something went wrong while adding the candidate.');
    } finally {
      setIsSaving(false); // Reset saving status after the operation completes
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCandidateStatus(id, { status: newStatus });
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id ? { ...candidate, status: newStatus } : candidate
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: "DELETE",
      });
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      showSuccess('Candidate Deleted!', 'The candidate has been successfully Deleted.');
    } catch (error) {
      showError('Oops...', 'Something went wrong while Deleting the candidate.');
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchPosition =
      positionFilter === "All" || c.position === positionFilter;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchStatus && matchPosition && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div className="flex space-x-4">
          <select
            className="border px-4 py-2 rounded-full focus:outline-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-full focus:outline-none bg-white"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="All">All Positions</option>
            {POSITION_OPTIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-full pl-10 pr-4 py-2 focus:outline-none w-full"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Add Candidate
        </button>
      </div>

      {/* Candidates Table */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="p-3">Sr no.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Position</th>
                <th className="p-3">Status</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Resume</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c, i) => (
                <tr key={c._id} className="border-b text-center">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.position}</td>
                  <td className="p-3">
                    <select
                      className="border px-4 py-2 rounded-full bg-white"
                      value={c.status}
                      onChange={(e) =>
                        handleStatusChange(c._id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">{c.experience || 0}</td>
                  <td className="p-3">
                    {c.resume ? (
                      <a
                        href={c.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[900px] h-[550px] rounded-2xl shadow-xl overflow-auto">
            <div className="bg-purple-700 text-white py-4 px-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Candidate</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl focus:outline-none bg-white"
                  required
                >
                  <option value="">Select Position*</option>
                  {POSITION_OPTIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (Years)*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <input
                  type="file"
                  name="resume"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                  accept=".pdf"
                />


                <div className="col-span-2 flex justify-center mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-800"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
