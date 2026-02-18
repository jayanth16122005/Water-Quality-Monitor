import { useState } from "react";

function SubmitReport() {
  const [form, setForm] = useState({
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    water_source: "",
    photo_url: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);

      const response = await fetch("http://127.0.0.1:8000/reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit report");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        water_source: "",
        photo_url: "",
        status: "pending",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "2px solid #d1fae5",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#0d9488",
    boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.1)",
  };

  const labelStyle = {
    display: "block",
    marginTop: "16px",
    marginBottom: "6px",
    fontWeight: "700",
    color: "#0f766e",
    fontSize: "14px",
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(13, 148, 136, 0.12)",
    border: "1px solid #d1fae5",
  };

  const headerStyle = {
    marginBottom: "30px",
    paddingLeft: "16px",
    borderLeft: "4px solid #0d9488",
    color: "#0f766e",
    fontWeight: "800",
    fontSize: "24px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginTop: "24px",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
    boxShadow: "0 6px 16px rgba(13, 148, 136, 0.4)",
  };

  const successStyle = {
    padding: "14px",
    backgroundColor: "#d1fae5",
    border: "2px solid #0d9488",
    borderRadius: "8px",
    color: "#0f766e",
    fontWeight: "700",
    marginBottom: "16px",
    display: success ? "block" : "none",
  };

  const coordSectionStyle = {
    backgroundColor: "#ecfdf5",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
    border: "1px solid #d1fae5",
  };

  const coordLabelStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    marginBottom: "8px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>📋 Submit Water Pollution Report</h2>

      <div style={successStyle}>✓ Report submitted successfully!</div>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Location Name *</label>
        <input
          name="location"
          placeholder="e.g., Yamuna River, Delhi"
          value={form.location}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
          style={inputStyle}
          required
        />

        <div style={coordSectionStyle}>
          <div style={coordLabelStyle}>📍 Coordinates (Optional)</div>
          
          <label style={labelStyle}>Latitude</label>
          <input
            name="latitude"
            placeholder="e.g., 28.6139"
            value={form.latitude}
            onChange={handleChange}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
            style={inputStyle}
          />

          <label style={labelStyle}>Longitude</label>
          <input
            name="longitude"
            placeholder="e.g., 77.2090"
            value={form.longitude}
            onChange={handleChange}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
            style={inputStyle}
          />
        </div>

        <label style={labelStyle}>Water Source *</label>
        <input
          name="water_source"
          placeholder="e.g., River, Lake, Ocean, Groundwater"
          value={form.water_source}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
          onBlur={(e) => (e.target.style.borderColor = "#d1fae5")}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Description *</label>
        <textarea
          name="description"
          placeholder="Describe the pollution details, observations, and impact..."
          value={form.description}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
          onBlur={(e) => (e.target.style.borderColor = "#d1fae5")}
          style={{
            ...inputStyle,
            minHeight: "120px",
            resize: "vertical",
          }}
          required
        />

        <label style={labelStyle}>Photo URL (Optional)</label>
        <input
          name="photo_url"
          placeholder="https://example.com/photo.jpg"
          value={form.photo_url}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
          onBlur={(e) => (e.target.style.borderColor = "#d1fae5")}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";
            e.target.style.boxShadow = "0 6px 16px rgba(13, 148, 136, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(135deg, #0d9488 0%, #10b981 100%)";
            e.target.style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.3)";
          }}
          style={buttonStyle}
        >
          {loading ? "🔄 Submitting..." : "✓ Submit Report"}
        </button>
      </form>

      <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b", textAlign: "center" }}>
        Fields marked with * are required
      </div>
    </div>
  );
}

export default SubmitReport;
