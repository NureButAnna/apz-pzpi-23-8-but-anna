import { useState, useEffect, useCallback } from "react";
import { Loader, Th, Td, BadgeGreen, BadgeRed, BadgeYellow, StatCard } from "../components/UserTable";
import { userApi } from "../../../api/userApi";
import styles from "../user.module.css";

const WASTE_TYPES = ["Всі", "Скло", "Папір", "Пластик", "Метал"];

export default function ContainersPanel() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Всі");

  const load = useCallback(() => {
    userApi.getContainersStatus()
      .then((r) => setContainers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const getFillColor = (fill) => {
    if (fill >= 80) return "#F39C12";
    if (fill >= 50) return "#E5B93D";
    return "#41B87A";
  };

  const getStatusBadge = (status) => {
    if (status === "active" || status === "активний") return <BadgeGreen>{status}</BadgeGreen>;
    if (status === "переповнений") return <BadgeRed>{status}</BadgeRed>;
    return <BadgeYellow>{status}</BadgeYellow>;
  };

  if (loading) return <Loader />;

  const filtered = filter === "Всі"
    ? containers
    : containers.filter((c) => c.waste_type?.toLowerCase() === filter.toLowerCase());

  const totalFull = containers.filter((c) => (c.fill_level ?? 0) >= 80).length;
  const avgFill = containers.length > 0
    ? Math.round(containers.reduce((s, c) => s + (c.fill_level ?? 0), 0) / containers.length)
    : 0;

  return (
    <div>
      <h2 className={styles.panelTitle}>Стан контейнерів</h2>

      <div className={styles.statsGrid}>
        <StatCard icon="🗑️" value={containers.length} label="Всього контейнерів" color="#41B87A" />
        <StatCard icon="🔴" value={totalFull} label="Критично заповнено" color="#F39C12" />
        <StatCard icon="📊" value={`${avgFill}%`} label="Середнє заповнення" color="#2196F3" />
      </div>

      <div className={styles.filterRow}>
        {WASTE_TYPES.map((t) => (
          <button
            key={t}
            className={`${styles.categoryBtn} ${filter === t ? styles.categoryBtnActive : ""}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Тип відходів</Th>
            <Th>Адреса</Th>
            <Th>Заповнення</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                Контейнерів не знайдено
              </td>
            </tr>
          ) : filtered.map((c) => (
            <tr key={c.container_id} className={styles.tr}>
              <Td>{c.container_id}</Td>
              <Td><span className={styles.badgeGreen}>{c.waste_type}</span></Td>
              <Td>{c.container_site?.address || "—"}</Td>
              <Td>
                <div className={styles.progressWrap}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${c.fill_level ?? 0}%`,
                        background: getFillColor(c.fill_level ?? 0),
                      }}
                    />
                  </div>
                  <span
                    className={styles.progressLabel}
                    style={{ color: getFillColor(c.fill_level ?? 0), fontWeight: 700 }}
                  >
                    {c.fill_level ?? 0}%
                  </span>
                </div>
              </Td>
              <Td>{getStatusBadge(c.status)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}