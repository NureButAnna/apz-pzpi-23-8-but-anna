import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Loader, StatCard } from "../components/UserTable";
import styles from "../user.module.css";
import { userApi } from "../../../api/userApi";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const getFillColor = (fill) => {
  if (fill >= 80) return "#F39C12";
  if (fill >= 50) return "#E5B93D";
  return "#41B87A";
};

const createIcon = (fill) => L.divIcon({
  className: "",
  html: `<div style="
    background:${getFillColor(fill)};border:3px solid #fff;
    border-radius:50%;width:30px;height:30px;
    display:flex;align-items:center;justify-content:center;
    font-size:10px;font-weight:700;color:#fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.25);">${fill}%</div>`,
  iconSize: [30, 30], iconAnchor: [15, 15],
});

export default function MapPanel() {
  const [sites, setSites] = useState([]);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  const load = useCallback(() => {
    Promise.all([
      userApi.getContainerSites(),
      userApi.getContainersStatus(),
    ])
      .then(([sitesRes, contRes]) => {
        setSites(sitesRes.data);
        setContainers(contRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const containersBySite = containers.reduce((acc, c) => {
    const id = c.container_site?.site_id;
    if (!acc[id]) acc[id] = [];
    acc[id].push(c);
    return acc;
  }, {});

  const avgFill = (siteId) => {
    const cs = containersBySite[siteId] || [];
    if (!cs.length) return 0;
    return Math.round(cs.reduce((s, c) => s + (c.fill_level ?? 0), 0) / cs.length);
  };

  const validSites = sites.filter((s) => s.location_lat && s.location_lng);
  const filtered = validSites.filter((s) =>
    `${s.street} ${s.building}`.toLowerCase().includes(search.toLowerCase())
  );

  const center = validSites.length > 0
    ? [
        validSites.reduce((s, x) => s + x.location_lat, 0) / validSites.length,
        validSites.reduce((s, x) => s + x.location_lng, 0) / validSites.length,
      ]
    : [49.9935, 36.2304];

  const criticalCount = sites.filter((s) => avgFill(s.container_site_id) >= 80).length;

  return (
    <div>
      <h2 className={styles.panelTitle}>Карта майданчиків</h2>

      <div className={styles.statsGrid}>
        <StatCard icon="📍" value={sites.length} label="Майданчиків у місті" color="#41B87A" />
        <StatCard icon="🗑️" value={containers.length} label="Контейнерів" color="#2196F3" />
        <StatCard icon="🔴" value={criticalCount} label="Критично заповнених" color="#F39C12" />
      </div>

      {/* Пошук */}
      <div className={styles.filterRow}>
        <input
          className={styles.input}
          placeholder="🔍 Пошук за адресою..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
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
              width: 12, height: 12, borderRadius: "50%",
              background: l.color, border: "2px solid #fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }} />
            <span style={{ fontSize: 12, color: "#6B7280" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Карта */}
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 32 }}>
        <MapContainer center={center} zoom={13} style={{ height: 420, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((site) => {
            const fill = avgFill(site.container_site_id);
            const siteCont = containersBySite[site.container_site_id] || [];
            return (
              <Marker
                key={site.container_site_id}
                position={[site.location_lat, site.location_lng]}
                icon={createIcon(fill)}
              >
                <Popup>
                  <div style={{ minWidth: 190 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                      {site.street}, {site.building}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>
                        Контейнерів: {siteCont.length}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getFillColor(fill) }}>
                        {fill}%
                      </span>
                    </div>
                    <div style={{ background: "#F0F0F0", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: `${fill}%`, height: "100%", background: getFillColor(fill), borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {[...new Set(siteCont.map((c) => c.waste_type))].map((t) => (
                        <span key={t} style={{
                          background: "#E8F5E9", color: "#41B87A",
                          fontSize: 11, fontWeight: 600, borderRadius: 4, padding: "2px 7px",
                        }}>{t}</span>
                      ))}
                    </div>
                    
                      href={`https://www.google.com/maps/dir/?api=1&destination=${site.location_lat},${site.location_lng}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block", marginTop: 10, textAlign: "center",
                        background: "#41B87A", color: "#fff", borderRadius: 6,
                        padding: "6px", fontSize: 12, fontWeight: 700,
                        textDecoration: "none",
                      }}
                     <a>
                      🗺️ Прокласти маршрут
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}