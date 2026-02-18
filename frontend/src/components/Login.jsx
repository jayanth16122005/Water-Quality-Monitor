import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Invalid credentials");

        const data = await res.json();
        localStorage.setItem("token", data.access_token);

        const meRes = await fetch(`${API}/me`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        if (!meRes.ok) throw new Error("Failed to fetch user");

        const user = await meRes.json();
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "authority") {
          navigate("/authority-dashboard");
        } else {
          navigate("/user-dashboard");
        }

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

        if (!res.ok) throw new Error("Registration failed");

        alert("Registered successfully. Please login.");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="user">User</option>
                <option value="authority">Authority</option>
              </select>
            </>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={buttonStyle}>
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span style={linkStyle} onClick={() => setMode("register")}>
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={linkStyle} onClick={() => setMode("login")}>
                Login
              </span>
            </>
          )}
        </p>
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
};

const linkStyle = {
  color: "#0d9488",
  cursor: "pointer",
  fontWeight: "600",
  transition: "color 0.2s ease",
};

export default Login;
