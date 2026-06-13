import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../../api/adminApi";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import styles from "../admin.module.css";

const EMPTY_FORM = {
  type: "Пластик",
  capacity: "",
  fill_level: "0",
  status: "active",
  container_site_id: "",
};

const CONTAINER_TYPES = ["Пластик", "Скло", "Папір", "Метал", "Змішані"];
const STATUSES = ["active", "inactive", "maintenance"];

export default function ContainersPanel() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminApi.getContainers()
      .then((r) => setContainers(r.data))
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
      await adminApi.createContainer({
        ...form,
        capacity: Number(form.capacity),
        fill_level: Number(form.fill_level),
        container_site_id: Number(form.container_site_id),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка створення контейнера");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити контейнер?")) return;
    await adminApi.deleteContainer(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Контейнери</h2>
        <button
          className={styles.btnPrimary}
          onClick={() => { setShowForm((v) => !v); setError(""); }}
        >
          {showForm ? "✕ Скасувати" : "+ Додати контейнер"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <h3 className={styles.formTitle}>Новий контейнер</h3>

          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Тип</label>
              <select className={styles.input} name="type" value={form.type} onChange={handleChange}>
                {CONTAINER_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Статус</label>
              <select className={styles.input} name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Місткість (л)</label>
              <input
                className={styles.input}
                name="capacity"
                type="number"
                min="1"
                placeholder="240"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Заповнення (%)</label>
              <input
                className={styles.input}
                name="fill_level"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={form.fill_level}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>ID майданчика</label>
              <input
                className={styles.input}
                name="container_site_id"
                type="number"
                min="1"
                placeholder="1"
                value={form.container_site_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formField} />
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={saving}>
            {saving ? "Збереження..." : "Створити контейнер"}
          </button>
        </form>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Тип</Th>
              <Th>Майданчик</Th>
              <Th>Місткість</Th>
              <Th>Заповнення</Th>
              <Th>Статус</Th>
              <Th>Дія</Th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.container_id} className={styles.tr}>
                <Td>{c.container_id}</Td>
                <Td>{c.type}</Td>
                <Td>{c.container_site_id}</Td>
                <Td>{c.capacity} л</Td>
                <Td>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${c.fill_level ?? 0}%`,
                          background:
                            c.fill_level >= 80
                              ? "#F39C12"
                              : c.fill_level >= 50
                              ? "#E5B93D"
                              : "#41B87A",
                        }}
                      />
                    </div>
                    <span className={styles.progressLabel}>
                      {c.fill_level ?? 0}%
                    </span>
                  </div>
                </Td>
                <Td>
                  {c.status === "active"
                    ? <BadgeGreen>{c.status}</BadgeGreen>
                    : <BadgeRed>{c.status}</BadgeRed>}
                </Td>
                <Td>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDelete(c.container_id)}
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