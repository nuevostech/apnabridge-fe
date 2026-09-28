import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import {
  getAdminJobs,
  approveJob,
  rejectJob,
  deleteJob,
} from "../../utils/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const response = await getAdminJobs();

      setJobs(response.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveJob(id);

      alert("Job approved successfully.");

      await loadJobs();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectJob(id);

      alert("Job rejected successfully.");

      await loadJobs();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await deleteJob(id);

      alert("Job deleted successfully.");

      await loadJobs();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return <h3>Loading jobs...</h3>;
  }

  return (
    <div className="admin-page">
      <div style={{ marginBottom: "25px" }}>
        <h1>Job Approval Management</h1>
        <p>Manage job postings.</p>
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
              <th style={headerStyle}>Job Title</th>
              <th style={headerStyle}>Company</th>
              <th style={headerStyle}>Category</th>
              <th style={headerStyle}>Country</th>
              <th style={headerStyle}>Location</th>
              <th style={headerStyle}>Type</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Created</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td style={cellStyle}>{job.title}</td>

                  <td style={cellStyle}>{job.company || "-"}</td>

                  <td style={cellStyle}>{job.category || "-"}</td>

                  <td style={cellStyle}>
                    {job.country ? job.country.toUpperCase() : "-"}
                  </td>

                  <td style={cellStyle}>{job.location || "-"}</td>

                  <td style={cellStyle}>{job.jobType || "-"}</td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        color: "#fff",
                        fontWeight: 600,
                        background:
                          job.status === "Approved"
                            ? "#16a34a"
                            : job.status === "Rejected"
                            ? "#dc2626"
                            : "#f59e0b",
                      }}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={cellStyle}>
                    <div style={actionsWrapper}>
                      {job.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(job.id)}
                            style={approveIconBtn}
                            title="Approve"
                          >
                            <FaCheck />
                          </button>

                          <button
                            onClick={() => handleReject(job.id)}
                            style={rejectIconBtn}
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(job.id)}
                        style={deleteIconBtn}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
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

const actionsWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const approveIconBtn = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1.5px solid #22c55e",
  background: "#fff",
  color: "#22c55e",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  transition: "background 0.15s",
};

const rejectIconBtn = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1.5px solid #ef4444",
  background: "#fff",
  color: "#ef4444",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  transition: "background 0.15s",
};

const deleteIconBtn = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1.5px solid #d1d5db",
  background: "#fff",
  color: "#6b7280",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  transition: "background 0.15s",
};

export default Jobs;