import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getAttendance, markCandidateAttendance } from "../../services/api"; // ✅ Updated import
import { showSuccess, showError, showConfirm } from "../../helpers/Swalfire.js"; // ✅ Import custom Swal helpers

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      console.log("Attendance Data:", res);
      setRecords(res);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm("Are you sure you want to delete this record?");
    if (!isConfirmed) return;

    try {
      setRecords((prev) => prev.filter((rec) => rec._id !== id));
      showSuccess("Record deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      showError("Failed to delete the record.");
    }
  };

  const handleAttendanceChange = async (id, updatedStatus) => {
    try {
      await markCandidateAttendance(id, updatedStatus); 
      setRecords((prev) =>
        prev.map((record) =>
          record._id === id ? { ...record, attendance: updatedStatus } : record
        )
      );
      console.log(`Marked ${updatedStatus} for candidate ID ${id}`);
      showSuccess(`Attendance marked as ${updatedStatus}.`);
    } catch (error) {
      console.error("Error updating attendance:", error);
      showError("Failed to update attendance.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-purple-50 p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Attendance Records</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center text-purple-600">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-center text-purple-500">No attendance records found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="p-4 text-left">Sr No.</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Joining Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-purple-100 transition duration-150"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 text-purple-800 font-medium">{item.name}</td>
                  <td className="p-4 text-purple-700">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={item.attendance || ""}
                      onChange={(e) =>
                        handleAttendanceChange(item._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-semibold outline-none transition
                        ${item.attendance === "Present"
                          ? "bg-purple-100 text-purple-800"
                          : item.attendance === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"}
                      `}
                    >
                      <option value="">Select</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-purple-700 hover:text-red-600 transition duration-150"
                      title="Delete"
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
    </div>
  );
};

export default Attendance;
