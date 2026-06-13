import { useTranslation } from "react-i18next";
import { adminApi } from "../../../api/adminApi";
import { downloadCSV } from "../../../utils/csvExport";
import styles from "../admin.module.css";

export default function ExportPanel() {
  const { t } = useTranslation();

  const EXPORTS = [
    { id: "users",      icon: "👤", labelKey: "admin.users",      descKey: "admin.usersDesc",      fn: () => adminApi.getUsers(),      file: "users.csv"      },
    { id: "sites",      icon: "📍", labelKey: "admin.sites",      descKey: "admin.sitesDesc",      fn: () => adminApi.getSites(),      file: "sites.csv"      },
    { id: "containers", icon: "🗑️", labelKey: "admin.containers", descKey: "admin.containersDesc", fn: () => adminApi.getContainers(), file: "containers.csv" },
    { id: "tips",       icon: "♻️", labelKey: "admin.tips",       descKey: "admin.tipsDesc",       fn: () => adminApi.getTips(),       file: "tips.csv"       },
  ];

  const handleExport = async (item) => {
    try {
      const res = await item.fn();
      downloadCSV(res.data, item.file);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{t("admin.export")}</h2>
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24, marginTop: -8 }}>
        {t("admin.exportDesc")}
      </p>
      <div className={styles.exportGrid}>
        {EXPORTS.map((e) => (
          <div key={e.id} className={styles.exportCard}>
            <div className={styles.exportIconWrap}>
              <span className={styles.exportIconEmoji}>{e.icon}</span>
            </div>
            <div>
              <div className={styles.exportLabel}>{t(e.labelKey)}</div>
              <div className={styles.exportDesc}>{t(e.descKey)}</div>
            </div>
            <button className={styles.btnExport} onClick={() => handleExport(e)}>
              ↓ {t("admin.downloadCSV")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}