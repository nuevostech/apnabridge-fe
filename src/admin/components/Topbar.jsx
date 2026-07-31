const Topbar = ({ title }) => {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p style={{ color: "#777", marginTop: "5px" }}>
          Welcome to the APNABRIDGE Admin Dashboard
        </p>
      </div>

      
    </div>
  );
};

export default Topbar;