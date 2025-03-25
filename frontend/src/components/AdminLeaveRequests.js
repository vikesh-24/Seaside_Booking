import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/requests");
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/leave/update-status/${id}`, { status });

      if (response.status === 200) {
        setLeaveRequests(prev =>
          prev.map(request => (request._id === id ? { ...request, status } : request))
        );
      }
    } catch (error) {
      console.error("❌ Error updating leave status:", error);
    }
  };

  // ✅ Function to generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Leave Requests Report", 14, 10);

    const tableColumn = ["First Name", "Last Name", "Role", "Start Date", "End Date", "Reason", "Status"];
    const tableRows = [];

    leaveRequests.forEach(request => {
      const requestData = [
        request.firstName,
        request.lastName,
        request.role,
        new Date(request.startDate).toLocaleDateString(),
        new Date(request.endDate).toLocaleDateString(),
        request.reason,
        request.status
      ];
      tableRows.push(requestData);
    });

    // ✅ Use `autoTable(doc, {...})` instead of `doc.autoTable({...})`
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }, // Blue header
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Light grey row
    });

    doc.save("Leave_Requests_Report.pdf");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Leave Requests</h2>
        <button
          onClick={generateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Generate Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map(request => (
                <tr key={request._id} className="text-center">
                  <td className="border p-2">{request.firstName}</td>
                  <td className="border p-2">{request.lastName}</td>
                  <td className="border p-2">{request.role}</td>
                  <td className="border p-2">{new Date(request.startDate).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(request.endDate).toLocaleDateString()}</td>
                  <td className="border p-2">{request.reason}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        request.status === "Approved"
                          ? "bg-green-500"
                          : request.status === "Denied"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    {request.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => updateStatus(request._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(request._id, "Denied")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
