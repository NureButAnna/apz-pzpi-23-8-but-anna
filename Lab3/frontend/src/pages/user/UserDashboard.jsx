import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import MapPanel from "./panels/MapPanel";
import ContainersPanel from "./panels/ContainersPanel";
import TipsPanel from "./panels/TipsPanel";
import NotificationsPanel from "./panels/NotificationsPanel";
import ProfilePanel from "./panels/ProfilePanel";
import styles from "./user.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function UserDashboard() {
  const [active, setActive] = useState("map");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      axios
        .get(`${API}/users/${userId}`, { headers: getHeaders() })
        .then((r) => setUser(r.data))
        .catch(console.error);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const panels = {
    map: <MapPanel />,
    containers: <ContainersPanel />,
    tips: <TipsPanel />,
    notifications: <NotificationsPanel />,
    profile: <ProfilePanel />,
  };

  return (
    <div className={styles.root}>
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={onLogout}
        user={user}
      />
      <main className={styles.main}>{panels[active]}</main>
    </div>
  );
}