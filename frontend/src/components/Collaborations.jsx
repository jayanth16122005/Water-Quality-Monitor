import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function Collaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ngo_name: "",
    project_name: "",
    contact_email: "",
    phone: "",
    location: "",
    description: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCollaborations = async () => {
    try {
      const res = await fetch(`${API}/collaborations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCollaborations(data);
    } catch (err) {
      console.error("Failed to fetch collaborations", err);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/collaborations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchCollaborations();
        setShowForm(false);
        setForm({
          ngo_name: "",
          project_name: "",
          contact_email: "",
          phone: "",
          location: "",
          description: "",
          website: "",
        });
        alert("Collaboration added successfully!");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCollaboration = async (id) => {
    if (window.confirm("Are you sure you want to delete this collaboration?")) {
      try {
        const res = await fetch(`${API}/collaborations/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          fetchCollaborations();
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const containerStyle = {
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)",
  };

  const headerStyle = {
    marginBottom: "20px",
    paddingLeft: "12px",
    borderLeft: "4px solid #0d9488",
    color: "#0f766e",
    fontWeight: "800",
    fontSize: "28px",
  };

  const cardStyle = {
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.08)",
  };

  const formStyle = {
    maxWidth: "600px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #d1fae5",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #d1fae5",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "8px",
  };

  const deleteButtonStyle = {
    padding: "8px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>🤝 NGO Collaborations</h2>

      {user?.role === "authority" && (
        <button
          onClick={() => setShowForm(!showForm)}
          style={buttonStyle}
        >
          {showForm ? "Cancel" : "+ Add Collaboration"}
        </button>
      )}

      {showForm && user?.role === "authority" && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3 style={{ color: "#0f766e", marginBottom: "12px" }}>New Collaboration</h3>
          <input
            name="ngo_name"
            placeholder="NGO Name"
            value={form.ngo_name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            name="project_name"
            placeholder="Project Name"
            value={form.project_name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            name="contact_email"
            type="email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "100px" }}
          />
          <input
            name="website"
            placeholder="Website (Optional)"
            value={form.website}
            onChange={handleChange}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Creating..." : "Create Collaboration"}
          </button>
        </form>
      )}

      {collaborations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #d1fae5",
            color: "#0f766e",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>No collaborations yet</p>
        </div>
      ) : (
        collaborations.map((collab) => (
          <div key={collab.id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <div>
                <h3 style={{ color: "#0f766e", marginBottom: "4px", fontSize: "18px", fontWeight: "700" }}>
                  🏛️ {collab.ngo_name}
                </h3>
                <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", margin: "0" }}>
                  {collab.project_name}
                </p>
              </div>
              {user?.role === "authority" && (
                <button
                  onClick={() => deleteCollaboration(collab.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              )}
            </div>

            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "8px" }}>
              {collab.description}
            </p>

            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              <p>📍 <strong>Location:</strong> {collab.location}</p>
              <p>📧 <strong>Email:</strong> {collab.contact_email}</p>
              {collab.phone && <p>📞 <strong>Phone:</strong> {collab.phone}</p>}
              {collab.website && (
                <p>
                  🌐{" "}
                  <strong>
                    <a
                      href={collab.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0d9488", textDecoration: "none" }}
                    >
                      Visit Website
                    </a>
                  </strong>
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Collaborations;
