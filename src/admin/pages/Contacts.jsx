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
      setLoading(true);

      const response = await getContacts();

      setContacts(response.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
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
              <th style={headerStyle}>#</th>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>Email</th>
              <th style={headerStyle}>Message</th>
              <th style={headerStyle}>Created</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No contact messages found.
                </td>
              </tr>
            ) : (
              contacts.map((item, index) => (
                <tr key={item.id}>
                  <td style={cellStyle}>
                    {index + 1}
                  </td>

                  <td style={cellStyle}>
                    {item.name}
                  </td>

                  <td style={cellStyle}>
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
                      ...cellStyle,
                      maxWidth: "400px",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.message
                      ? item.message.length > 100
                        ? item.message.substring(0, 100) + "..."
                        : item.message
                      : "-"}
                  </td>

                  <td style={cellStyle}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
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

export default Contacts;