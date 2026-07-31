import { useEffect, useState } from "react";
import { getContacts } from "../../utils/api";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getContacts();

      console.log("Contacts:", response);

      // response = { success: true, data: [...] }
      setContacts(response.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading contact messages...</h3>;
  }

  return (
    <div className="admin-page">
      <div style={{ marginBottom: "25px" }}>
        <h1>Contact Messages</h1>
        <p>Manage contact form submissions.</p>
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
              <th style={{ padding: "15px" }}>Email</th>
              <th style={{ padding: "15px" }}>Message</th>
              <th style={{ padding: "15px" }}>Created</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: "15px" }}>
                    {index + 1}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {item.name}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <a
                      href={`mailto:${item.email}`}
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                      }}
                    >
                      {item.email}
                    </a>
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      maxWidth: "400px",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.message.length > 100
                      ? item.message.substring(0, 100) + "..."
                      : item.message}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;