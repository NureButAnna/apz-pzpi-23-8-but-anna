import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { StatCard, Loader } from "../components/MunicipalTable";
import styles from "../municipal.module.css";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Виправлення іконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getFillColor = (fill) => {
  if (fill >= 80) return "#F39C12";
  if (fill >= 50) return "#E5B93D";
  return "#41B87A";
};

const createMarkerIcon = (fill) => {
  const color = getFillColor(fill);
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      ">${fill}%</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function MapPanel() {
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [containers, setContainers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/container-sites/`, { headers: getHeaders() }),
      axios.get(`${API}/containers/`, { headers: getHeaders() }),
      axios.get(`${API}/pickups/statistics`, { headers: getHeaders() }),
    ])
      .then(([sitesRes, containersRes, statsRes]) => {
        setSites(sitesRes.data);
        setContainers(containersRes.data);
        setStats(statsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Групуємо контейнери по site_id
  const containersBySite = containers.reduce((acc, c) => {
    const id = c.container_site_id;
    if (!acc[id]) acc[id] = [];
    acc[id].push(c);
    return acc;
  }, {});

  // Середній рівень заповнення для майданчика
  const avgFill = (siteId) => {
    const cs = containersBySite[siteId] || [];
    if (!cs.length) return 0;
    return Math.round(cs.reduce((s, c) => s + (c.fill_level ?? 0), 0) / cs.length);
  };

  // Центр карти — середнє по всіх майданчиках
  const validSites = sites.filter((s) => s.location_lat && s.location_lng);
  const center =
    validSites.length > 0
      ? [
          validSites.reduce((s, x) => s + x.location_lat, 0) / validSites.length,
          validSites.reduce((s, x) => s + x.location_lng, 0) / validSites.length,
        ]
      : [49.9935, 36.2304];

  // Статистика по заповненню
  const criticalSites = sites.filter((s) => avgFill(s.container_site_id) >= 80).length;
  const warningSites = sites.filter((s) => {
    const f = avgFill(s.container_site_id);
    return f >= 50 && f < 80;
  }).length;
  const okSites = sites.filter((s) => avgFill(s.container_site_id) < 50).length;

  return (
    <div>
      <h2 className={styles.panelTitle}>
        {t("municipal.overview")}
      </h2>

      {/* Статистика */}
      <div className={styles.statsGrid} style={{ marginBottom: 24 }}>
        <StatCard
          icon="📍"
          value={sites.length}
          label={t("municipal.sites")}
          color="#41B87A"
        />
        <StatCard
          icon="🚚"
          value={stats?.total_pickups ?? 0}
          label={t("municipal.totalPickups")}
          color="#2196F3"
        />
        <StatCard
          icon="✅"
          value={stats?.completed_pickups ?? 0}
          label={t("municipal.completed")}
          color="#4CAF50"
        />
        <StatCard icon="🔴" value={criticalSites} label="Критичних (≥80%)" color="#F39C12" />
        <StatCard icon="🟡" value={warningSites} label="Увага (50-80%)" color="#E5B93D" />
        <StatCard icon="🟢" value={okSites} label="Норма (<50%)" color="#41B87A" />
      </div>

      {/* Легенда */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { color: "#41B87A", label: "Норма (<50%)" },
          { color: "#E5B93D", label: "Увага (50-80%)" },
          { color: "#F39C12", label: "Критично (≥80%)" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: l.color, border: "2px solid #fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
            }} />
            <span style={{ fontSize: 13, color: "#6B7280" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Карта */}
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: 500, width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validSites.map((site) => {
            const fill = avgFill(site.container_site_id);
            const siteCont = containersBySite[site.container_site_id] || [];

            return (
              <Marker
                key={site.container_site_id}
                position={[site.location_lat, site.location_lng]}
                icon={createMarkerIcon(fill)}
              >
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                      {site.street}, {site.building}
                    </div>
                    {site.description && (
                      <div style={{ fontSize: 12, color: "#9E9E9E", marginBottom: 8 }}>
                        {site.description}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {t("municipal.containers")}: {siteCont.length}
                      </span>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: getFillColor(fill),
                      }}>
                        {fill}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      background: "#F0F0F0",
                      borderRadius: 99,
                      height: 8,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${fill}%`,
                        height: "100%",
                        background: getFillColor(fill),
                        borderRadius: 99,
                        transition: "width 0.3s",
                      }} />
                    </div>
                    {/* Типи відходів */}
                    <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {[...new Set(siteCont.map((c) => c.type))].map((type) => (
                        <span key={type} style={{
                          background: "#E8F5E9",
                          color: "#41B87A",
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Таблиця майданчиків */}
      <h3 className={styles.panelTitle} style={{ fontSize: 18, marginTop: 32 }}>
        {t("municipal.mySites")}
      </h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>{t("municipal.address")}</th>
            <th className={styles.th}>{t("municipal.containers")}</th>
            <th className={styles.th}>{t("municipal.fillLevel")}</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => {
            const fill = avgFill(s.container_site_id);
            return (
              <tr key={s.container_site_id} className={styles.tr}>
                <td className={styles.td}>{s.container_site_id}</td>
                <td className={styles.td}>{s.street}, {s.building}</td>
                <td className={styles.td}>
                  {(containersBySite[s.container_site_id] || []).length}
                </td>
                <td className={styles.td}>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${fill}%`,
                          background: getFillColor(fill),
                        }}
                      />
                    </div>
                    <span className={styles.progressLabel}
                      style={{ color: getFillColor(fill), fontWeight: 700 }}>
                      {fill}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}