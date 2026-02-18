import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function Analytics() {
  const [stations, setStations] = useState([]);
  const [readings, setReadings] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("pH");
  const [dateRange, setDateRange] = useState("7days");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchReadings(selectedStation);
    }
  }, [selectedStation]);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${API}/stations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch stations", err);
    }
  };

  const fetchReadings = async (stationId) => {
    try {
      const res = await fetch(`${API}/stations/${stationId}/readings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReadings(data);
    } catch (err) {
      console.error("Failed to fetch readings", err);
    }
  };

  const getFilteredReadings = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return readings
      .filter((r) => {
        const readingDate = new Date(r.recorded_at);
        return readingDate >= startDate && r.parameter === selectedParameter;
      })
      .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  };

  const calculateStats = () => {
    const filtered = getFilteredReadings();
    if (filtered.length === 0) return { min: 0, max: 0, avg: 0 };

    const values = filtered.map((r) => parseFloat(r.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

    return { min: min.toFixed(2), max: max.toFixed(2), avg };
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

  const controlsStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  };

  const selectStyle = {
    padding: "8px 12px",
    border: "1px solid #d1fae5",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#0f766e",
    fontWeight: "500",
  };

  const cardStyle = {
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.08)",
  };

  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  };

  const statBoxStyle = {
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.08)",
  };

  const statValueStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0d9488",
    margin: "8px 0",
  };

  const statLabelStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
  };

  const filteredReadings = getFilteredReadings();
  const stats = calculateStats();

  const chartHeight = Math.max(...filteredReadings.map((r) => parseFloat(r.value)), 100);

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>📊 Water Quality Analytics</h2>

      <div style={controlsStyle}>
        <select
          value={selectedStation || ""}
          onChange={(e) => setSelectedStation(parseInt(e.target.value))}
          style={selectStyle}
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedParameter}
          onChange={(e) => setSelectedParameter(e.target.value)}
          style={selectStyle}
        >
          <option value="pH">pH</option>
          <option value="DO">Dissolved Oxygen</option>
          <option value="turbidity">Turbidity</option>
          <option value="lead">Lead</option>
          <option value="arsenic">Arsenic</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={selectStyle}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div style={statsContainerStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>📉 Minimum</div>
          <div style={statValueStyle}>{stats.min}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>📈 Maximum</div>
          <div style={statValueStyle}>{stats.max}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>📊 Average</div>
          <div style={statValueStyle}>{stats.avg}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>📞 Data Points</div>
          <div style={statValueStyle}>{filteredReadings.length}</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "#0f766e", marginBottom: "16px", fontSize: "18px", fontWeight: "700" }}>
          Trend Chart - {selectedParameter}
        </h3>

        {filteredReadings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>No data available for selected period</p>
        ) : (
          <div style={{ overflowX: "auto", minHeight: "300px", position: "relative" }}>
            <svg
              width="100%"
              height="300"
              style={{ minWidth: "600px" }}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
                <line
                  key={`grid-${i}`}
                  x1="50"
                  y1={300 - percent * 250}
                  x2="100%"
                  y2={300 - percent * 250}
                  stroke="#e0e7ff"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Data line */}
              <polyline
                points={filteredReadings
                  .map((r, i) => {
                    const x = 50 + (i / (filteredReadings.length - 1)) * (Math.max(0, document.body.offsetWidth - 150));
                    const y = 50 + (1 - parseFloat(r.value) / chartHeight) * 250;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
              />

              {/* Data points */}
              {filteredReadings.map((r, i) => {
                const x = 50 + (i / (filteredReadings.length - 1)) * (Math.max(0, document.body.offsetWidth - 150));
                const y = 50 + (1 - parseFloat(r.value) / chartHeight) * 250;
                return (
                  <circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#0d9488"
                  />
                );
              })}
            </svg>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "#0f766e", marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>
          Reading History
        </h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredReadings.length === 0 ? (
            <p style={{ color: "#64748b" }}>No readings available</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #d1fae5" }}>
                  <th style={{ textAlign: "left", padding: "8px", color: "#0f766e", fontWeight: "600" }}>
                    Date & Time
                  </th>
                  <th style={{ textAlign: "left", padding: "8px", color: "#0f766e", fontWeight: "600" }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.slice(-20).reverse().map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e0e7ff" }}>
                    <td style={{ padding: "8px", color: "#475569", fontSize: "13px" }}>
                      {new Date(r.recorded_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", color: "#0d9488", fontWeight: "600", fontSize: "14px" }}>
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
