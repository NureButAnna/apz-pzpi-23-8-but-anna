import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UsersPanel from "./panels/UsersPanel";
import SitesPanel from "./panels/SitesPanel";
import ContainersPanel from "./panels/ContainersPanel";
import OrganizationPanel from "./panels/OrganizationPanel";
import CompaniesPanel from "./panels/CompaniesPanel";
import TipsPanel from "./panels/TipsPanel";
import ExportPanel from "./panels/ExportPanel";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [active, setActive] = useState("users");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const panels = {
    users: <UsersPanel />,
    companies: <CompaniesPanel />,
    organizations: <OrganizationPanel />,
    sites: <SitesPanel />,
    containers: <ContainersPanel />,
    tips: <TipsPanel />,
    export: <ExportPanel />,
  };

  return (
    <div className={styles.root}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main className={styles.main}>{panels[active]}</main>
    </div>
  );
}