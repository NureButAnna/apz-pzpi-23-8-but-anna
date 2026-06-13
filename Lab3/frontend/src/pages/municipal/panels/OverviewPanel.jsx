import { useState, useEffect } from "react";
import { Th, Td, Loader, StatCard } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import styles from "../municipal.module.css";

export default function OverviewPanel() {
  const [stats, setStats] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      municipalApi.getPickupStats(),
      municipalApi.getSites(),
    ])
      .then(([statsRes, sitesRes]) => {
        setStats(statsRes.data);
        setSites(sitesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Огляд</h2>
      <div className={styles.statsGrid}>
        <StatCard icon="📍" value={sites.length}                                          label="Майданчиків"    color="#41B87A" />
        <StatCard icon="🚚" value={stats?.total_pickups ?? 0}                             label="Вивозів всього" color="#2196F3" />
        <StatCard icon="✅" value={stats?.completed_pickups ?? 0}                         label="Завершених"     color="#4CAF50" />
        <StatCard icon="⏳" value={(stats?.total_pickups ?? 0) - (stats?.completed_pickups ?? 0)} label="Заплановано" color="#F39C12" />
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Мої майданчики</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>Адреса</Th>
              <Th>Вхід</Th>
              <Th>Координати</Th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.container_site_id} className={styles.tr}>
                <Td>{s.street}, {s.building}</Td>
                <Td>{s.entrance ?? "—"}</Td>
                <Td>{s.location_lat}, {s.location_lng}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}