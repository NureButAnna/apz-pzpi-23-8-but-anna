import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader, StatCard } from "../components/CompanyTable";
import { companyApi } from "../../../api/companyApi";
import { downloadCSV } from "../../../utils/csvExport";
import styles from "../company.module.css";

const WASTE_COLORS = {
  "Пластик": "#2196F3", "Скло": "#41B87A", "Папір": "#F39C12",
  "Метал": "#9C27B0", "Електроніка": "#F44336", "Інше": "#9CA3AF",
};

export default function StatisticsPanel() {
  const { t } = useTranslation();
  const [stats, setStats] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    companyApi.getStatistics(dateFrom, dateTo)
      .then((r) => { if (!cancelled) setStats(r.data); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [trigger]);

  const handleApply = () => { setStats([]); setTrigger((n) => n + 1); };

  const handleExport = () => {
    if (!stats.length) return;
    downloadCSV(stats, "waste_statistics.csv", {
      waste_type:      t("company.wasteType"),
      total_requests:  t("company.totalRequests"),
      total_amount_kg: t("company.totalWaste"),
    });
  };

  const totalKg = stats.reduce((s, i) => s + (i.total_amount_kg ?? 0), 0);
  const totalRequests = stats.reduce((s, i) => s + (i.total_requests ?? 0), 0);

  return (
    <div>
      <h2 className={styles.panelTitle}>{t("company.statsTitle")}</h2>

      <div className={styles.filterRow}>
        <div>
          <label className={styles.filterLabel}>{t("common.from")}</label>
          <input className={styles.input} type="date" value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className={styles.filterLabel}>{t("common.to")}</label>
          <input className={styles.input} type="date" value={dateTo}
            onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div className={styles.filterActions}>
          <button className={styles.btnPrimary} onClick={handleApply}>
            {t("common.apply")}
          </button>
          <button className={styles.btnOutline} onClick={handleExport} disabled={!stats.length}>
            📥 {t("common.export")} CSV
          </button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className={styles.statsGrid} style={{ marginBottom: 32 }}>
            <StatCard icon="📦" value={totalRequests}    label={t("company.totalRequests")} color="#2196F3" />
            <StatCard icon="⚖️" value={`${totalKg} кг`} label={t("company.totalWaste")}    color="#41B87A" />
            <StatCard icon="♻️" value={stats.length}     label={t("company.wasteTypes")}    color="#F39C12" />
          </div>

          {stats.length > 0 ? (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                {t("company.breakdown")}
              </h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>{t("company.wasteType")}</th>
                    <th className={styles.th}>{t("company.totalRequests")}</th>
                    <th className={styles.th}>{t("company.totalWaste")}</th>
                    <th className={styles.th}>{t("company.share")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => {
                    const color = WASTE_COLORS[s.waste_type] ?? "#9CA3AF";
                    const pct = totalKg > 0 ? Math.round(((s.total_amount_kg ?? 0) / totalKg) * 100) : 0;
                    return (
                      <tr key={s.waste_type} className={styles.tr}>
                        <td className={styles.td}>
                          <span style={{ background: `${color}22`, color, fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "3px 10px", display: "inline-block" }}>
                            {s.waste_type}
                          </span>
                        </td>
                        <td className={styles.td}>{s.total_requests}</td>
                        <td className={styles.td}>{s.total_amount_kg ?? 0} кг</td>
                        <td className={styles.td}>
                          <div className={styles.progressWrap}>
                            <div className={styles.progressTrack}>
                              <div className={styles.progressBar} style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <span className={styles.progressLabel}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              {t("company.noStats")}
            </div>
          )}
        </>
      )}
    </div>
  );
}