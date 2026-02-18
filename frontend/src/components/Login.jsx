import { useState } from "react";

const API = "http://localhost:8000";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.detail || "Invalid credentials");
        }

        localStorage.setItem("token", data.access_token);

        const meRes = await fetch(`${API}/me`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const user = await meRes.json();
        
        if (!meRes.ok) {
          localStorage.removeItem("token");
          throw new Error(user.detail || "Failed to fetch user");
        }

        localStorage.setItem("user", JSON.stringify(user));
        onLogin();
      } else {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Registration failed");
        }

        setError("");
        alert("✓ Registered successfully. Please login.");
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#0f766e", marginBottom: "20px" }}>
          {mode === "login" ? "🔐 Login" : "📝 Register"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="user">👤 Regular User</option>
                <option value="authority">👮 Authority/Admin</option>
              </select>
            </>
          )}

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {error && (
            <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>
              ❌ {error}
            </p>
          )}

          <button 
            type="submit" 
            style={{...buttonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer"}}
            disabled={loading}
          >
            {loading ? "Loading..." : (mode === "login" ? "Login" : "Register")}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span style={linkStyle} onClick={() => { setMode("register"); setError(""); }}>
                Register here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={linkStyle} onClick={() => { setMode("login"); setError(""); }}>
                Login here
              </span>
            </>
          )}
        </p>

        {mode === "register" && (
          <p style={{ marginTop: "16px", padding: "12px", background: "#ecfdf5", borderRadius: "6px", fontSize: "12px", color: "#0f766e" }}>
            💡 Test Credentials:<br/>
            User: user@example.com / password123<br/>
            Authority: authority@example.com / password123
          </p>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0f766e 0%, #1e7e74 50%, #0d9488 100%)",
};

const cardStyle = {
  width: "360px",
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 20px 25px rgba(15, 118, 110, 0.15)",
  border: "1px solid #ecfdf5",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
  fontSize: "16px",
};

const linkStyle = {
  color: "#0d9488",
  cursor: "pointer",
  fontWeight: "600",
  transition: "color 0.2s ease",
  textDecoration: "underline",
};

export default Login;
