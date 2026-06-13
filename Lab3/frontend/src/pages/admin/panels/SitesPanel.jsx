import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader } from "../components/AdminTable";
import { adminApi } from "../../../api/adminApi";
import styles from "../admin.module.css";

const EMPTY_FORM = {
  organization_id: "",
  city_id: "",
  street: "",
  building: "",
  entrance: "",
  description: "",
  location_lat: "",
  location_lng: "",
};

export default function SitesPanel() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminApi.getSites()
      .then((r) => setSites(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminApi.createSite({
        organization_id: Number(form.organization_id),
        city_id: form.city_id ? Number(form.city_id) : null,
        street: form.street || null,
        building: form.building || null,
        entrance: form.entrance || null,
        description: form.description || null,
        location_lat: form.location_lat ? Number(form.location_lat) : null,
        location_lng: form.location_lng ? Number(form.location_lng) : null,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка створення майданчика");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити майданчик?")) return;
    await adminApi.deleteSite(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Контейнерні майданчики</h2>
        <button
          className={styles.btnPrimary}
          onClick={() => { setShowForm((v) => !v); setError(""); }}
        >
          {showForm ? "✕ Скасувати" : "+ Додати майданчик"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <h3 className={styles.formTitle}>Новий майданчик</h3>

          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>ID організації</label>
              <input
                className={styles.input}
                name="organization_id"
                type="number"
                min="1"
                placeholder="1"
                value={form.organization_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>ID міста</label>
              <input
                className={styles.input}
                name="city_id"
                type="number"
                min="1"
                placeholder="1"
                value={form.city_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Вулиця</label>
              <input
                className={styles.input}
                name="street"
                placeholder="вул. Сумська"
                value={form.street}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Будинок</label>
              <input
                className={styles.input}
                name="building"
                placeholder="12"
                value={form.building}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Під'їзд</label>
              <input
                className={styles.input}
                name="entrance"
                placeholder="1"
                value={form.entrance}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Опис</label>
              <input
                className={styles.input}
                name="description"
                placeholder="Біля входу"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Широта</label>
              <input
                className={styles.input}
                name="location_lat"
                type="number"
                step="any"
                placeholder="49.9935"
                value={form.location_lat}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Довгота</label>
              <input
                className={styles.input}
                name="location_lng"
                type="number"
                step="any"
                placeholder="36.2304"
                value={form.location_lng}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={saving}>
            {saving ? "Збереження..." : "Створити майданчик"}
          </button>
        </form>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Адреса</Th>
              <Th>Під'їзд</Th>
              <Th>Місто</Th>
              <Th>Організація</Th>
              <Th>Координати</Th>
              <Th>Опис</Th>
              <Th>Дія</Th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.container_site_id} className={styles.tr}>
                <Td>{s.container_site_id}</Td>
                <Td>{s.street ?? "—"}, {s.building ?? "—"}</Td>
                <Td>{s.entrance ?? "—"}</Td>
                <Td>{s.city_id ?? "—"}</Td>
                <Td>{s.organization_id}</Td>
                <Td style={{ fontSize: 12, color: "#9E9E9E" }}>
                  {s.location_lat && s.location_lng
                    ? `${s.location_lat}, ${s.location_lng}`
                    : "—"}
                </Td>
                <Td>{s.description ?? "—"}</Td>
                <Td>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDelete(s.container_site_id)}
                  >
                    Видалити
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}