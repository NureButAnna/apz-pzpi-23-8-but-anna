import { useTranslation } from "react-i18next";
import styles from "../user.module.css";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher";

export default function Sidebar({ active, setActive, onLogout, user }) {
  const { t } = useTranslation();

  const MENU = [
    { id: "map", label: "🗺️ " + t("user.map") },
    { id: "containers", label: "🗑️ " + t("user.containers") },
    { id: "tips", label: "♻️ " + t("user.tips") },
    { id: "notifications", label: "🔔 " + t("user.notifications") },
    { id: "profile", label: "👤 " + t("common.profile") },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy</div>
      {user && (
        <div style={{ padding: "0 24px 16px", borderBottom: "1px solid #E5F5EC", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
            {user.first_name} {user.last_name || ""}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            {user.email}
          </div>
        </div>
      )}
      <nav className={styles.sidebarNav}>
        {MENU.map((m) => (
          <button
            key={m.id}
            className={`${styles.sidebarItem} ${active === m.id ? styles.sidebarItemActive : ""}`}
            onClick={() => setActive(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "0 12px", marginBottom: 12 }}>
        <LanguageSwitcher />
      </div>
      <button className={styles.logoutBtn} onClick={onLogout}>
        🚪 {t("common.logout")}
      </button>
    </aside>
  );
}