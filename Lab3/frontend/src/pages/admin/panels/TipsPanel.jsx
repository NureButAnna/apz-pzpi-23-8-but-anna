import { useState, useEffect } from "react";
import { adminApi } from "../../../api/adminApi";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import styles from "../admin.module.css";

export default function TipsPanel() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", category: "Пластик" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminApi.getTips()
      .then((r) => setTips(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createTip({ ...form, is_published: true });
      setForm({ title: "", content: "", category: "Пластик" });
      load();
    } catch (err) {
      console.error("Помилка додавання поради:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити пораду?")) return;
    await adminApi.deleteTip(id);
    load();
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Поради</h2>
      <form onSubmit={handleAdd} className={styles.addForm}>
        <h3 className={styles.formTitle}>Додати пораду</h3>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="Заголовок"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <select
            className={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {["Пластик", "Скло", "Папір", "Метал"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea
          className={{ ...styles.input, minHeight: 80, resize: "vertical" }}
          placeholder="Текст поради..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : "Додати"}
        </button>
      </form>

      {loading ? <Loader /> : (
        <div className={styles.tableWrapper}><table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th><Th>Заголовок</Th><Th>Категорія</Th><Th>Статус</Th><Th>Дія</Th>
            </tr>
          </thead>
          <tbody>
            {tips.map((t) => (
              <tr key={t.tip_id} className={styles.tr}>
                <Td>{t.tip_id}</Td>
                <Td>{t.title}</Td>
                <Td><BadgeGreen>{t.category}</BadgeGreen></Td>
                <Td>{t.is_published ? <BadgeGreen>Опублікована</BadgeGreen> : <BadgeRed>Чернетка</BadgeRed>}</Td>
                <Td>
                  <button className={styles.btnDanger} onClick={() => handleDelete(t.tip_id)}>
                    Видалити
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  );
}