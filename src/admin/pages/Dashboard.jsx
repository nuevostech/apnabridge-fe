import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    approvedBusinesses: 0,
    pendingBusinesses: 0,
    rejectedBusinesses: 0,
    totalTestimonials: 0,
    totalContacts: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardSummary();
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p>Welcome to the APNABRIDGE Admin Dashboard</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
gap: "16px",
          marginTop: "30px",
        }}
      >
        <DashboardCard
          title="Total Businesses"
          value={stats.totalBusinesses}
        />

        <DashboardCard
          title="Approved"
          value={stats.approvedBusinesses}
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingBusinesses}
        />

        <DashboardCard
          title="Testimonials"
          value={stats.totalTestimonials}
        />

        <DashboardCard
          title="Contacts"
          value={stats.totalContacts}
        />

        <DashboardCard
          title="Rejected"
          value={stats.rejectedBusinesses}
        />
      </div>
    </div>
  );
};

function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "18px 22px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: "120px",          // Fixed height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 500,
          color: "#333",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          margin: 0,
          fontSize: "42px",
          color: "#D97706",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Dashboard;