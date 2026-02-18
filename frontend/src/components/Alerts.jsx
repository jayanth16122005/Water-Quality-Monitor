import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/alerts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlerts(data);
      filterAlerts(data, filterType);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const filterAlerts = (alertsList, type) => {
    if (type === "all") {
      setFilteredAlerts(alertsList);
    } else {
      setFilteredAlerts(alertsList.filter((a) => a.type === type));
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (type) => {
    setFilterType(type);
    filterAlerts(alerts, type);
  };

  const resolveAlert = async (alertId) => {
    try {
      const res = await fetch(`${API}/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626",
    };
    return colors[severity] || "#0d9488";
  };

  const getAlertIcon = (type) => {
    const icons = {
      boil_notice: "🔥",
      contamination: "⚠️",
      outage: "❌",
    };
    return icons[type] || "📢";
  };

  const alertContainerStyle = {
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

  const filterButtonsStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const filterButtonStyle = (isActive) => ({
    padding: "8px 16px",
    background: isActive ? "linear-gradient(135deg, #0d9488 0%, #10b981 100%)" : "rgba(13, 148, 136, 0.1)",
    color: isActive ? "white" : "#0d9488",
    border: `2px solid ${isActive ? "#0d9488" : "#d1fae5"}`,
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  });

  const alertCardStyle = {
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.08)",
    borderLeft: `4px solid ${getSeverityColor(alerts.find((a) => a.id === alerts[0]?.id)?.severity || "medium")}`,
  };

  const alertTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#0f766e",
  };

  const alertMessageStyle = {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "12px",
    lineHeight: "1.6",
  };

  const badgeStyle = (severity) => ({
    display: "inline-block",
    padding: "4px 12px",
    background: getSeverityColor(severity),
    color: "white",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    marginRight: "8px",
  });

  return (
    <div style={alertContainerStyle}>
      <h2 style={headerStyle}>🚨 Water Quality Alerts</h2>

      <div style={filterButtonsStyle}>
        <button
          style={filterButtonStyle(filterType === "all")}
          onClick={() => handleFilterChange("all")}
        >
          All Alerts
        </button>
        <button
          style={filterButtonStyle(filterType === "boil_notice")}
          onClick={() => handleFilterChange("boil_notice")}
        >
          Boil Notices
        </button>
        <button
          style={filterButtonStyle(filterType === "contamination")}
          onClick={() => handleFilterChange("contamination")}
        >
          Contamination
        </button>
        <button
          style={filterButtonStyle(filterType === "outage")}
          onClick={() => handleFilterChange("outage")}
        >
          Outages
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
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
          <p style={{ fontSize: "16px", fontWeight: "600" }}>✓ No active alerts</p>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            All water quality parameters are within safe limits
          </p>
        </div>
      ) : (
        filteredAlerts.map((alert) => (
          <div key={alert.id} style={alertCardStyle}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px", marginRight: "12px" }}>{getAlertIcon(alert.type)}</span>
              <div>
                <div style={alertTitleStyle}>{alert.location}</div>
                <div>
                  <span style={badgeStyle(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    {new Date(alert.issued_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p style={alertMessageStyle}>{alert.message}</p>

            {alert.latitude && alert.longitude && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#0d9488",
                  marginBottom: "12px",
                }}
              >
                📍 Lat: {alert.latitude}, Lon: {alert.longitude}
              </p>
            )}

            {user?.role === "authority" && alert.is_active === "true" && (
              <button
                onClick={() => resolveAlert(alert.id)}
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
                Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;
