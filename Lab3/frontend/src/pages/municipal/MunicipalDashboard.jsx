import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapPanel from "./panels/MapPanel";
import ContainersPanel from "./panels/ContainersPanel";
import PickupsPanel from "./panels/PickupsPanel";
import DevicesPanel from "./panels/DevicesPanel";
import RequestsPanel from "./panels/RequestsPanel";
import StatisticsPanel from "./panels/StatisticsPanel";
import styles from "./municipal.module.css";

export default function MunicipalDashboard() {
  const [active, setActive] = useState("map");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const panels = {
    map: <MapPanel />,
    containers: <ContainersPanel />,
    pickups: <PickupsPanel />,
    devices: <DevicesPanel />,
    requests: <RequestsPanel />,
    stats: <StatisticsPanel />,
  };

  return (
    <div className={styles.root}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main className={styles.main}>{panels[active]}</main>
    </div>
  );
}