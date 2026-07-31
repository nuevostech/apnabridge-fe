import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTestimonials } from "../../utils/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await getTestimonials();

      console.log("Testimonials:", response);

      // response = { success: true, data: [...] }
      setTestimonials(response.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
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
              <th style={{ padding: "15px" }}>#</th>
              <th style={{ padding: "15px" }}>Name</th>
              <th style={{ padding: "15px" }}>Business</th>
              <th style={{ padding: "15px" }}>Quote</th>
              <th style={{ padding: "15px" }}>Created</th>
              {/* <th style={{ padding: "15px" }}>Action</th> */}
            </tr>
          </thead>

          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: "15px" }}>{index + 1}</td>

                  <td style={{ padding: "15px" }}>
                    {item.name}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {item.business}
                  </td>

                  <td style={{ padding: "15px", maxWidth: "350px" }}>
                    {item.quote.length > 80
                      ? item.quote.substring(0, 80) + "..."
                      : item.quote}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  {/* <td style={{ padding: "15px" }}>
                    <Link
                      to={`/admin/testimonials/${item.id}`}
                      style={{
                        background: "#3b82f6",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}
                    >
                      View
                    </Link>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
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

export default Testimonials;