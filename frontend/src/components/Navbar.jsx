function Navbar({ onNavigate, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={navStyle}>
      <div>
        <button style={btnStyle} onClick={() => onNavigate("map")}>
          Station Map
        </button>

        {user?.role === "user" && (
          <>
            <button style={btnStyle} onClick={() => onNavigate("report")}>
              Submit Report
            </button>
            <button style={btnStyle} onClick={() => onNavigate("view")}>
              View Reports
            </button>
          </>
        )}

        {user?.role === "authority" && (
          <>
            <button style={btnStyle} onClick={() => onNavigate("view")}>
              All Reports
            </button>
            <button style={btnStyle} onClick={() => onNavigate("verify")}>
              Verify Reports
            </button>
          </>
        )}
      </div>

      <button style={logoutStyle} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  background: "#020617",
};

const btnStyle = {
  marginRight: "10px",
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const logoutStyle = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Navbar;  