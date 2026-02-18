import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API = "http://127.0.0.1:8000";

function StationMap() {
  const [stations, setStations] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch water stations
    fetch(`${API}/stations/`)
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations", err));

    // Fetch reports with coordinates
    if (token) {
      fetch(`${API}/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setReports(data.filter(r => r.latitude && r.longitude)))
        .catch((err) => console.error("Failed to load reports", err));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          marginBottom: "14px",
          paddingLeft: "12px",
          borderLeft: "4px solid #0d9488",
          color: "#0f766e",
          fontWeight: "700",
        }}
      >
        🌍 Real-time Station Map
      </h2>

      <div
        style={{
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#f8fbf9",
          boxShadow: "0 10px 30px rgba(13, 148, 136, 0.15)",
          border: "1px solid #d1fae5",
        }}
      >
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {stations.map((station) => (
            <Marker
              key={`station-${station.id}`}
              position={[station.latitude, station.longitude]}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                Location: {station.location}
              </Popup>
            </Marker>
          ))}

          {reports.map((report) => (
            <Marker
              key={`report-${report.id}`}
              position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
            >
              <Popup>
                <strong>Report: {report.location}</strong>
                <br />
                Description: {report.description}
                <br />
                Water Source: {report.water_source}
                <br />
                Status: {report.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default StationMap;
