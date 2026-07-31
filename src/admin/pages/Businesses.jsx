import { useEffect, useState } from "react";
import {
  getAdminBusinesses,
  approveBusiness,
  rejectBusiness,
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

  if (loading) {
    return <h3>Loading businesses...</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Business Approval Management</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={thStyle}>Business</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>Plan</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {businesses.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No businesses found.
              </td>
            </tr>
          ) : (
            businesses.map((business) => (
              <tr key={business.id}>
                <td style={tdStyle}>{business.name}</td>

                <td style={tdStyle}>
                  {business.category_slug || "-"}
                </td>

                <td style={tdStyle}>
                  {business.city || "-"}
                </td>

                <td style={tdStyle}>
                  {business.plan}
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      color: "#fff",
                      background:
                        business.status === "Approved"
                          ? "green"
                          : business.status === "Rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {business.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  {business.created_at
                    ? new Date(
                        business.created_at
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      handleApprove(business.id)
                    }
                    disabled={
                      business.status === "Approved"
                    }
                    style={approveBtn}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(business.id)
                    }
                    disabled={
                      business.status === "Rejected"
                    }
                    style={rejectBtn}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
};

const approveBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  background: "#28a745",
  color: "#fff",
};

const rejectBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  background: "#dc3545",
  color: "#fff",
};

export default Businesses;