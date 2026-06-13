import { useState, useEffect, useCallback } from "react";
import { Loader, Th, Td, BadgeGreen, BadgeRed } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import styles from "../municipal.module.css";

const EMPTY_FORM = { type: "", container_site_id: "", fill_level: 0, status: "active" };
const CONTAINER_TYPES = ["Пластик", "Скло", "Папір", "Метал", "Змішані"];

export default function ContainersPanel() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    municipalApi.getContainers()
      .then((r) => setContainers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await municipalApi.createContainer({
        type: form.type,
        container_site_id: Number(form.container_site_id),
        fill_level: Number(form.fill_level),
        status: form.status,
        capacity: 240,
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Не вдалося створити контейнер");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити контейнер?")) return;
    try {
      await municipalApi.deleteContainer(id);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Не вдалося видалити контейнер");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Контейнери</h2>

      <form onSubmit={handleCreate} className={styles.addForm}>
        <h3 className={styles.formTitle}>Створити контейнер</h3>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Тип</label>
            <select className={styles.input} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })} required>
              <option value="">Оберіть тип</option>
              {CONTAINER_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>ID майданчика</label>
            <input className={styles.input} type="number" min="1" placeholder="1"
              value={form.container_site_id}
              onChange={(e) => setForm({ ...form, container_site_id: e.target.value })} required />
          </div>
        </div>
        <button className={styles.btnPrimary} type="submit">+ Створити</button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th><Th>Тип</Th><Th>Майданчик</Th>
              <Th>Заповнення</Th><Th>Статус</Th><Th>Дія</Th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.container_id} className={styles.tr}>
                <Td>{c.container_id}</Td>
                <Td>{c.type}</Td>
                <Td>{c.container_site_id}</Td>
                <Td>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressBar} style={{
                        width: `${c.fill_level ?? 0}%`,
                        background: c.fill_level >= 80 ? "#F39C12" : c.fill_level >= 50 ? "#E5B93D" : "#41B87A",
                      }} />
                    </div>
                    <span className={styles.progressLabel}>{c.fill_level ?? 0}%</span>
                  </div>
                </Td>
                <Td>
                  {c.status === "active" || c.status === "активний"
                    ? <BadgeGreen>{c.status}</BadgeGreen>
                    : <BadgeRed>{c.status}</BadgeRed>}
                </Td>
                <Td>
                  <button className={styles.btnDanger} onClick={() => handleDelete(c.container_id)}>
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