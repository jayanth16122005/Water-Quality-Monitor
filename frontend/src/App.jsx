import { useState } from "react";
import StationMap from "./components/StationMap";
import Navbar from "./components/Navbar";
import SubmitReport from "./components/SubmitReport";
import ViewReports from "./components/ViewReports";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [page, setPage] = useState("map");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Navbar onNavigate={setPage} onLogout={handleLogout} />

      {page === "map" && <StationMap />}
      {page === "report" && <SubmitReport />}
      {page === "view" && <ViewReports filterType="pending" />}
      {page === "all_reports" && <ViewReports filterType="verified-rejected" />}
    </div>
  );
}

export default App;
