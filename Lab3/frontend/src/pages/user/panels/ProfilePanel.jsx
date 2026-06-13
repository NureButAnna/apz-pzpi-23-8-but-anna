import { useState, useEffect, useMemo } from "react";
import { Loader } from "../components/UserTable";
import { userApi } from "../../../api/userApi";
import styles from "../user.module.css";

export default function ProfilePanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({});
  const [citySearch, setCitySearch] = useState("");
  const [cityResults, setCityResults] = useState([]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    userApi.getUser(userId)
      .then((r) => {
        setUser(r.data);
        setForm({
          first_name: r.data.first_name || "",
          last_name: r.data.last_name || "",
          email: r.data.email || "",
          phone_number: r.data.phone_number || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!citySearch.trim()) {
      const timer = setTimeout(() => setCityResults([]), 0);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      userApi.searchCities(citySearch)
        .then((r) => setCityResults(r.data))
        .catch(console.error);
    }, 400);
    return () => clearTimeout(timer);
  }, [citySearch]);

  const handleSelectCity = async (city) => {
    try {
      await userApi.updateCity(userId, city.city_id);
      setUser((prev) => ({ ...prev, city_id: city.city_id }));
      setCitySearch(city.name);
      setCityResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  const daysInEcofy = useMemo(() => {
    if (!user?.created_at) return 0;
    const now = new Date();
    const created = new Date(user.created_at);
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await userApi.updateUser(userId, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Мій профіль</h2>

      {/* Статистика */}
      <div className={styles.statsGrid} style={{ marginBottom: 32 }}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🌿</span>
          <span className={styles.statValue} style={{ color: "#41B87A", fontSize: 28 }}>
            {daysInEcofy}
          </span>
          <span className={styles.statLabel}>днів в Ecofy</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📍</span>
          <span className={styles.statValue} style={{ color: "#2196F3", fontSize: 20, letterSpacing: "-0.5px" }}>
            {user?.city_id ? `Місто #${user.city_id}` : "Не вказано"}
          </span>
          <span className={styles.statLabel}>Поточне місто</span>
        </div>
      </div>

      {/* Вибір міста */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #E5F5EC", marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#0D1F0D" }}>
          📍 Змінити місто
        </h3>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <input
            className={styles.input}
            placeholder="Пошук міста..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
          {cityResults.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: "#fff", borderRadius: 10, marginTop: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid #E5F5EC", zIndex: 100,
              maxHeight: 220, overflowY: "auto",
            }}>
              {cityResults.map((city) => (
                <div
                  key={city.city_id}
                  onClick={() => handleSelectCity(city)}
                  style={{
                    padding: "10px 16px", cursor: "pointer",
                    fontSize: 14, color: "#111",
                    borderBottom: "1px solid #F3F4F6",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F0FAF4"}
                  onMouseLeave={(e) => e.currentTarget.style.background = ""}
                >
                  📍 {city.name}
                  {city.region && (
                    <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 8 }}>
                      {city.region}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Редагування профілю */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #E5F5EC" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#0D1F0D" }}>
          Редагувати профіль
        </h3>
        <form onSubmit={handleSave}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16, marginBottom: 24,
          }}>
            {[
              { key: "first_name", label: "Ім'я" },
              { key: "last_name", label: "Прізвище" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone_number", label: "Телефон", type: "tel" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{
                  display: "block", fontSize: 13, fontWeight: 600,
                  color: "#374151", marginBottom: 6,
                }}>
                  {f.label}
                </label>
                <input
                  className={styles.input}
                  type={f.type || "text"}
                  value={form[f.key] || ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className={styles.btnPrimary} type="submit" disabled={saving}>
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
            {success && (
              <span style={{ color: "#41B87A", fontSize: 14, fontWeight: 600 }}>
                ✓ Збережено
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}