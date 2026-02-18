import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function ViewReports({ filterType = "pending" }) {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReports = async () => {
    const res = await fetch(`${API}/reports/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${API}/reports/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      fetchReports();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#0f766e", borderLeft: "4px solid #0d9488", paddingLeft: "12px", marginBottom: "20px" }}>
        📊 {
          filterType === "pending" 
            ? (user?.role === "authority" ? "Pending Reports for Verification" : "My Submitted Reports")
            : "All Verified & Rejected Reports"
        }
      </h2>

      {reports
        .filter(r => {
          if (filterType === "verified-rejected") {
            return r.status === "verified" || r.status === "rejected";
          } else if (filterType === "pending") {
            if (user?.role === "authority") {
              return r.status === "pending";
            }
            return true;
          }
          return true;
        })
        .map((report) => (
        <div
          key={report.id}
          style={{
            border: "1px solid #d1fae5",
            padding: "16px",
            marginBottom: "16px",
            borderRadius: "8px",
            backgroundColor: "#ecfdf5",
            boxShadow: "0 2px 8px rgba(13, 148, 136, 0.08)",
          }}
        >
          <p><strong>Location:</strong> {report.location}</p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Water Source:</strong> {report.water_source}</p>
          <p><strong>Status:</strong> {report.status}</p>

          {user?.role === "authority" && filterType === "pending" && report.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus(report.id, "verified")}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginRight: "10px",
                }}
              >
                ✓ Verify
              </button>
              <button
                onClick={() => updateStatus(report.id, "rejected")}
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                ✕ Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewReports;
