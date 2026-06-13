import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RequestsPanel from "./panels/RequestsPanel";
import StatisticsPanel from "./panels/StatisticsPanel";
import ProfilePanel from "./panels/ProfilePanel";
import styles from "./company.module.css";

export default function CompanyDashboard() {
  const [active, setActive] = useState("requests");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const panels = {
    requests: <RequestsPanel />,
    stats: <StatisticsPanel />,
    profile: <ProfilePanel />,
  };

  return (
    <div className={styles.root}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main className={styles.main}>{panels[active]}</main>
    </div>
  );
}