function Navbar({ onNavigate, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={navStyle}>
      <div>
        <button 
          style={btnStyle} 
          onClick={() => onNavigate("map")}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.3)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
          }}
        >
          Station Map
        </button>

        {user?.role === "user" && (
          <>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("report")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Submit Report
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("view")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              View Reports
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("analytics")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Analytics
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("alerts")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Alerts
            </button>
          </>
        )}

        {user?.role === "authority" && (
          <>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("all_reports")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              All Reports
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("view")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Verify Reports
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("alerts")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Alerts
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("collaborations")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Collaborations
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("analytics")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Analytics
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("predictive")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Predictive Alerts
            </button>
          </>
        )}

        {user?.role === "user" && (
          <>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("predictive")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Predictive Alerts
            </button>
            <button 
              style={btnStyle} 
              onClick={() => onNavigate("alerts")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              Alerts
            </button>
          </>
        )}
      </div>

      <button 
        style={logoutStyle} 
        onClick={onLogout}
        onMouseEnter={(e) => {
          e.target.style.background = "#dc2626";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#ef4444";
        }}
      >
        Logout
      </button>
    </div>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  background: "linear-gradient(90deg, #0f766e 0%, #0d9488 100%)",
  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.15)",
};

const btnStyle = {
  marginRight: "10px",
  padding: "8px 16px",
  background: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "1.5px solid rgba(255, 255, 255, 0.4)",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
};

const logoutStyle = {
  padding: "8px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
};

export default Navbar;  