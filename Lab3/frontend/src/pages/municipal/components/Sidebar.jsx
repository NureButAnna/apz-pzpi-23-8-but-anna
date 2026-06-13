import { useTranslation } from "react-i18next";
import styles from "../municipal.module.css";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher";

export default function Sidebar({ active, setActive, onLogout }) {
  const { t } = useTranslation();

  const MENU = [
    { id: "map", label: "🗺️ " + t("municipal.overview") },
    { id: "containers", label: "🗑️ " + t("municipal.containers") },
    { id: "pickups", label: "🚚 " + t("municipal.pickups") },
    { id: "devices", label: "⚡ " + t("municipal.devices") },
    { id: "requests", label: "⚡ " + t("municipal.requests") },
    { id: "stats", label: "📈 " + t("municipal.stats") },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy Org</div>
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