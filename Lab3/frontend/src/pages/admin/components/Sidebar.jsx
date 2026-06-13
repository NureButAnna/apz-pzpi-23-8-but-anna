import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher";
import styles from "../admin.module.css";

export default function Sidebar({ active, setActive, onLogout }) {
  const { t } = useTranslation();

  const MENU = [
    { id: "users",         label: "👤 " + t("admin.users")         },
    { id: "companies",     label: "🏭 " + t("admin.companies")     },
    { id: "organizations", label: "🏢 " + t("admin.organizations") },
    { id: "sites",         label: "📍 " + t("admin.sites")         },
    { id: "containers",    label: "🗑️ " + t("admin.containers")    },
    { id: "tips",          label: "♻️ " + t("admin.tips")          },
    { id: "export",        label: "📥 " + t("admin.export")        },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy Admin</div>
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