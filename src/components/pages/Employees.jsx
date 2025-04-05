import React, { useEffect, useState } from "react";
import { getCandidates, deleteCandidate, updateCandidate } from "../../services/api.js";
import { Pencil, Trash2 } from "lucide-react";
import { showSuccess, showError, showConfirm } from "../../helpers/Swalfire.js";

const POSITION_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "DevOps Engineer"
];

const Employees = () => {
  const [hiredCandidates, setHiredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
  });

  useEffect(() => {
    fetchHiredCandidates();
  }, []);

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

  const handleDelete = async (id) => {
    const confirmDelete = await showConfirm("Are you sure you want to delete this candidate?", "This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteCandidate(id);
      showSuccess('Candidate Deleted!', 'The candidate has been successfully deleted.');
      fetchHiredCandidates();
    } catch (err) {
      console.error("Delete failed:", err);
      showError('Oops...', 'Something went wrong while deleting the candidate.');
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      position: candidate.position || "",
      experience: candidate.experience || "",
      resume: null,
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditingCandidate(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: null,
    });
    setShowModal(false);
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
    try {
      const updatedData = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          updatedData.append(key, val);
        }
      });

      await updateCandidate(editingCandidate._id, updatedData);
      showSuccess('Candidate Updated!', 'The candidate details have been successfully updated.');
      setShowModal(false);
      fetchHiredCandidates();
    } catch (err) {
      console.error("Update failed:", err);
      showError('Oops...', 'Something went wrong while updating the candidate.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Hired Employees</h2>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : hiredCandidates.length === 0 ? (
          <p className="text-center text-gray-500">No hired employees found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="p-3">Sr No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Position</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Resume</th>
                <th className="p-3">Joining Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hiredCandidates.map((emp, index) => (
                <tr key={emp._id} className="border-b text-center">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.phone}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3">{emp.experience || 0}</td>
                  <td className="p-3">
                    {emp.resume ? (
                      <a
                        href={emp.resume}
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
                    {new Date(emp.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[900px] h-[550px] rounded-2xl shadow-xl overflow-auto">
            <div className="bg-purple-700 text-white py-4 px-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-lg font-semibold">Update Employee</h2>
              <button
                onClick={handleModalClose}
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
                  value={formData.name}
                  placeholder="Full Name*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email Address*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number*"
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl"
                  onChange={handleChange}
                  required
                />
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border-2 border-purple-700 px-4 py-3 rounded-xl bg-white"
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
                  value={formData.experience}
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
                />

                {/* Joining Date - Read Only */}
                <input
                  type="text"
                  value={`Joining Date: ${new Date(editingCandidate.updatedAt).toLocaleDateString()}`}
                  disabled
                  className="col-span-2 w-full border-2 border-gray-300 px-4 py-3 rounded-xl bg-gray-100 text-center"
                />

                <div className="col-span-2 flex justify-center mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-800"
                  >
                    Save
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

export default Employees;
