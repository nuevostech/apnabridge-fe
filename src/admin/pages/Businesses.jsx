import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import {
  getAdminBusinesses,
  approveBusiness,
  rejectBusiness,
  deleteBusiness, // Add this API
} from "../../utils/api";

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const res = await getAdminBusinesses();
      setBusinesses(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveBusiness(id);
      alert("Business approved successfully.");
      loadBusinesses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBusiness(id);
      alert("Business rejected successfully.");
      loadBusinesses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;

    try {
      await deleteBusiness(id);
      alert("Business deleted successfully.");
      loadBusinesses();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <h3>Loading businesses...</h3>;
  }

  return (
    <div className="admin-page">
      <div style={{ marginBottom: "25px" }}>
        <h1>Business Approval Management</h1>
        <p>Manage business approvals.</p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f7f7f7",
                textAlign: "left",
              }}
            >
              <th style={headerStyle}>Business</th>
              <th style={headerStyle}>Category</th>
              <th style={headerStyle}>City</th>
              <th style={headerStyle}>Plan</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Created</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {businesses.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  No businesses found.
                </td>
              </tr>
            ) : (
              businesses.map((business) => (
                <tr key={business.id}>
                  <td style={cellStyle}>{business.name}</td>

                  <td style={cellStyle}>
                    {business.category_slug || "-"}
                  </td>

                  <td style={cellStyle}>
                    {business.city || "-"}
                  </td>

                  <td style={cellStyle}>{business.plan}</td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        color: "#fff",
                        fontWeight: 600,
                        background:
                          business.status === "Approved"
                            ? "#16a34a"
                            : business.status === "Rejected"
                            ? "#dc2626"
                            : "#f59e0b",
                      }}
                    >
                      {business.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {business.created_at
                      ? new Date(
                          business.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={cellStyle}>
                    {business.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(business.id)
                          }
                          style={approveIconBtn}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>

                        <button
                          onClick={() =>
                            handleReject(business.id)
                          }
                          style={rejectIconBtn}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(business.id)
                          }
                          style={deleteIconBtn}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

                    {(business.status === "Approved" ||
                      business.status === "Rejected") && (
                      <button
                        onClick={() =>
                          handleDelete(business.id)
                        }
                        style={deleteIconBtn}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const headerStyle = {
  padding: "15px",
};

const cellStyle = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

const approveIconBtn = {
  width: "42px",
  height: "42px",
  border: "1px solid #22c55e",
  background: "#fff",
  color: "#22c55e",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
  fontSize: "16px",
};

const rejectIconBtn = {
  width: "42px",
  height: "42px",
  border: "1px solid #ef4444",
  background: "#fff",
  color: "#ef4444",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
  fontSize: "16px",
};

const deleteIconBtn = {
  width: "42px",
  height: "42px",
  border: "1px solid #9ca3af",
  background: "#fff",
  color: "#6b7280",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Businesses;