import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    approvedBusinesses: 0,
    pendingBusinesses: 0,
    rejectedBusinesses: 0,

    totalTestimonials: 0,
    approvedTestimonials: 0,
    pendingTestimonials: 0,
    rejectedTestimonials: 0,

    totalContacts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getDashboardSummary();

      setStats(response.data || {});
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p>Welcome to the APNABRIDGE Admin Dashboard</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(240px, 1fr))",
          gap: "16px",
          marginTop: "30px",
        }}
      >
        <DashboardCard
          title="Total Businesses"
          value={stats.totalBusinesses}
        />

        <DashboardCard
          title="Approved Businesses"
          value={stats.approvedBusinesses}
        />

        <DashboardCard
          title="Pending Businesses"
          value={stats.pendingBusinesses}
        />

        <DashboardCard
          title="Rejected Businesses"
          value={stats.rejectedBusinesses}
        />

        <DashboardCard
          title="Total Testimonials"
          value={stats.totalTestimonials}
        />

        <DashboardCard
          title="Approved Testimonials"
          value={stats.approvedTestimonials}
        />

        <DashboardCard
          title="Pending Testimonials"
          value={stats.pendingTestimonials}
        />

        <DashboardCard
          title="Rejected Testimonials"
          value={stats.rejectedTestimonials}
        />

        <DashboardCard
          title="Total Contacts"
          value={stats.totalContacts}
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
        height: "120px",
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
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {value ?? 0}
      </h1>
    </div>
  );
}

export default Dashboard;