import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader, BadgeGreen, BadgeYellow } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import styles from "../municipal.module.css";

const EMPTY_FORM = { container_site_id: "", scheduled_time: "", vehicle_id: "" };

export default function PickupsPanel() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    municipalApi.getPickups()
      .then((r) => setPickups(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await municipalApi.createPickup({
        container_site_id: Number(form.container_site_id),
        scheduled_time:    form.scheduled_time,
        vehicle_id:        form.vehicle_id || null,
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка створення вивозу");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await municipalApi.completePickup(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити вивіз?")) return;
    await municipalApi.deletePickup(id);
    load();
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Графік вивозів</h2>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h3 className={styles.formTitle}>Запланувати вивіз</h3>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>ID майданчика</label>
            <input className={styles.input} type="number" placeholder="1"
              value={form.container_site_id}
              onChange={(e) => setForm({ ...form, container_site_id: e.target.value })} required />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Дата і час</label>
            <input className={styles.input} type="datetime-local"
              value={form.scheduled_time}
              onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} required />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Номер авто <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(необов'язково)</span></label>
            <input className={styles.input} placeholder="AA1234BB"
              value={form.vehicle_id}
              onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} />
          </div>
        </div>
        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : "Запланувати"}
        </button>
      </form>

      {loading ? <Loader /> : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <Th>ID</Th><Th>Майданчик</Th><Th>Заплановано</Th>
                <Th>Завершено</Th><Th>Авто</Th><Th>Дії</Th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((p) => (
                <tr key={p.pickup_id} className={styles.tr}>
                  <Td>{p.pickup_id}</Td>
                  <Td>{p.container_site_id}</Td>
                  <Td>{new Date(p.scheduled_time).toLocaleString("uk-UA")}</Td>
                  <Td>
                    {p.completed_time
                      ? <BadgeGreen>{new Date(p.completed_time).toLocaleString("uk-UA")}</BadgeGreen>
                      : <BadgeYellow>Очікується</BadgeYellow>}
                  </Td>
                  <Td>{p.vehicle_id ?? "—"}</Td>
                  <Td>
                    <div className={styles.actions}>
                      {!p.completed_time && (
                        <button className={styles.btnSuccess} onClick={() => handleComplete(p.pickup_id)}>
                          ✓ Завершити
                        </button>
                      )}
                      <button className={styles.btnDanger} onClick={() => handleDelete(p.pickup_id)}>
                        Видалити
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}