import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import {
  getAdminTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} from "../../utils/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await getAdminTestimonials();
      setTestimonials(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to approve this testimonial?"
  );

  if (!confirmed) return;

  try {
    await approveTestimonial(id);
    alert("Testimonial approved successfully.");
    fetchTestimonials();
  } catch (err) {
    alert(err.message);
  }
};

  const handleReject = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to reject this testimonial?"
  );

  if (!confirmed) return;

  try {
    await rejectTestimonial(id);
    alert("Testimonial rejected successfully.");
    fetchTestimonials();
  } catch (err) {
    alert(err.message);
  }
};

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this testimonial?");

    if (!confirmed) return;

    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <h3>Loading testimonials...</h3>;
  }

  return (
    <div className="admin-page">
      <div style={{ marginBottom: "25px" }}>
        <h1>Testimonials</h1>
        <p>Manage customer testimonials.</p>
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
              <th style={headerStyle}>#</th>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>Business</th>
              <th style={headerStyle}>Description</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Created</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((item, index) => {
                const status = item.status || "Pending";

                return (
                  <tr key={item.id}>
                    <td style={cellStyle}>{index + 1}</td>

                    <td style={cellStyle}>{item.name}</td>

                    <td style={cellStyle}>{item.business}</td>

                    <td style={{ ...cellStyle, maxWidth: "350px" }}>
                      {item.description
                        ? item.description.length > 80
                          ? item.description.substring(0, 80) + "..."
                          : item.description
                        : "-"}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          color: "#fff",
                          fontWeight: 600,
                          background:
                            status === "Approved"
                              ? "#16a34a"
                              : status === "Rejected"
                              ? "#dc2626"
                              : "#f59e0b",
                        }}
                      >
                        {status}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {item.created_at
  ? new Date(item.created_at).toLocaleDateString()
  : "-"}
                    </td>

                    <td style={cellStyle}>
                      {status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            style={approveBtn}
                            title="Approve"
                          >
                            <FaCheck />
                          </button>

                          <button
                            onClick={() => handleReject(item.id)}
                            style={rejectBtn}
                            title="Reject"
                          >
                            <FaTimes />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            style={deleteBtn}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}

                      {(status === "Approved" ||
                        status === "Rejected") && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={deleteBtn}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No testimonials found.
                </td>
              </tr>
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

const approveBtn = {
  width: "40px",
  height: "40px",
  border: "1px solid #22c55e",
  background: "#fff",
  color: "#22c55e",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const rejectBtn = {
  width: "40px",
  height: "40px",
  border: "1px solid #ef4444",
  background: "#fff",
  color: "#ef4444",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const deleteBtn = {
  width: "40px",
  height: "40px",
  border: "1px solid #9ca3af",
  background: "#fff",
  color: "#6b7280",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Testimonials;