import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader, StatCard } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import { downloadCSV } from "../../../utils/csvExport";
import styles from "../municipal.module.css";

export default function StatisticsPanel() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    municipalApi.getPickupStatistics(dateFrom, dateTo)
      .then((r) => { if (!cancelled) setStats(r.data); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [trigger]);

  const handleApply = () => { setStats(null); setTrigger((n) => n + 1); };

  const handleExport = () => {
    if (!stats) return;
    const pending = stats.total_pickups - stats.completed_pickups;
    const rate = stats.total_pickups > 0
      ? Math.round((stats.completed_pickups / stats.total_pickups) * 100) : 0;
    downloadCSV([{
      total_pickups: stats.total_pickups, completed_pickups: stats.completed_pickups,
      pending_pickups: pending, completion_rate: `${rate}%`,
      date_from: dateFrom || "—", date_to: dateTo || "—",
    }], "pickup_statistics.csv", {
      total_pickups:     t("municipal.totalPickups"),
      completed_pickups: t("municipal.completed"),
      pending_pickups:   t("municipal.pending"),
      completion_rate:   t("municipal.performance"),
      date_from:         t("municipal.dateFrom"),
      date_to:           t("municipal.dateTo"),
    });
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>{t("municipal.pickupStats")}</h2>
      <div className={styles.filterRow}>
        <div>
          <label className={styles.filterLabel}>{t("municipal.dateFrom")}</label>
          <input className={styles.input} type="date" value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className={styles.filterLabel}>{t("municipal.dateTo")}</label>
          <input className={styles.input} type="date" value={dateTo}
            onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className={styles.btnPrimary} onClick={handleApply}>{t("municipal.apply")}</button>
        <button className={styles.btnOutline} onClick={handleExport} disabled={!stats}>
          📥 {t("municipal.exportCSV")}
        </button>
      </div>
      {!stats ? <Loader /> : (
        <div className={styles.statsGrid}>
          <StatCard icon="🚚" value={stats.total_pickups}     label={t("municipal.totalPickups")} color="#2196F3" />
          <StatCard icon="✅" value={stats.completed_pickups} label={t("municipal.completed")}    color="#41B87A" />
          <StatCard icon="⏳" value={stats.total_pickups - stats.completed_pickups} label={t("municipal.pending")} color="#F39C12" />
          <StatCard icon="📊"
            value={stats.total_pickups > 0
              ? `${Math.round((stats.completed_pickups / stats.total_pickups) * 100)}%` : "0%"}
            label={t("municipal.performance")} color="#9C27B0" />
        </div>
      )}
    </div>
  );
}