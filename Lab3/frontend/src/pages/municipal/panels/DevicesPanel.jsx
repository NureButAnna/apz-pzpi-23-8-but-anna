import { useState, useEffect, useCallback } from "react";
import { Loader, Th, Td, BadgeGreen, BadgeRed } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import styles from "../municipal.module.css";

const EMPTY_FORM = { device_name: "", serial_number: "", device_type: "", container_id: "", battery_level: 100 };

export default function DevicesPanel() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    municipalApi.getDevices()
      .then((r) => setDevices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await municipalApi.createDevice({
        device_name:   form.device_name,
        serial_number: form.serial_number,
        device_type:   form.device_type  || null,
        container_id:  form.container_id ? Number(form.container_id) : null,
        battery_level: Number(form.battery_level),
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Не вдалося додати пристрій");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>IoT Пристрої</h2>

      <form onSubmit={handleCreate} className={styles.addForm}>
        <h3 className={styles.formTitle}>Додати пристрій</h3>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Назва</label>
            <input className={styles.input} name="device_name" placeholder="Sensor A1"
              value={form.device_name} onChange={handleChange} required />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Серійний номер</label>
            <input className={styles.input} name="serial_number" placeholder="SN-00001"
              value={form.serial_number} onChange={handleChange} required />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Тип</label>
            <input className={styles.input} name="device_type" placeholder="fill_sensor"
              value={form.device_type} onChange={handleChange} />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>ID контейнера <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(необов'язково)</span></label>
            <input className={styles.input} name="container_id" type="number" min="1" placeholder="—"
              value={form.container_id} onChange={handleChange} />
          </div>
        </div>
        <button className={styles.btnPrimary} type="submit">+ Додати</button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th><Th>Назва</Th><Th>Серійний номер</Th>
              <Th>Тип</Th><Th>Батарея</Th><Th>Контейнер</Th><Th>Статус</Th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.device_id} className={styles.tr}>
                <Td>{d.device_id}</Td>
                <Td>{d.device_name}</Td>
                <Td>{d.serial_number}</Td>
                <Td>{d.device_type ?? "—"}</Td>
                <Td>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressBar} style={{
                        width: `${d.battery_level ?? 0}%`,
                        background: d.battery_level <= 10 ? "#DC2626" : d.battery_level <= 20 ? "#F39C12" : "#41B87A",
                      }} />
                    </div>
                    <span className={styles.progressLabel}>{d.battery_level ?? 0}%</span>
                  </div>
                </Td>
                <Td>{d.container_id ?? "—"}</Td>
                <Td>
                  {d.status === "active"
                    ? <BadgeGreen>{d.status}</BadgeGreen>
                    : <BadgeRed>{d.status}</BadgeRed>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}