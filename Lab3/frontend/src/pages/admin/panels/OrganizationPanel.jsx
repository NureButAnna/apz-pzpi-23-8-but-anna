import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import { adminApi } from "../../../api/adminApi";
import { isActive } from "../../../utils/statusHelper";
import OrgForm from "./OrgForm";
import styles from "../admin.module.css";

export default function OrganizationsPanel() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(() => {
    adminApi.getOrganizations()
      .then((r) => setOrganizations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Видалити організацію?")) return;
    await adminApi.deleteOrganization(id);
    load();
  };

  const handleToggleStatus = async (id, current) => {
    await adminApi.updateOrgStatus(id, !isActive(current));
    load();
  };

  const handleAdd = async (form) => {
    setError("");
    if (form.password.length < 6) { setError("Пароль має бути мінімум 6 символів"); return; }
    setSaving(true);
    try {
      await adminApi.createOrganization(form);
      setShowAddForm(false);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка створення організації");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id, form) => {
    setError("");
    if (form.password && form.password.length < 6) { setError("Пароль має бути мінімум 6 символів"); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await adminApi.updateOrganization(id, payload);
      setEditingId(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка оновлення організації");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (id) => {
    setEditingId(editingId === id ? null : id);
    setError("");
    setShowAddForm(false);
  };

  const openAdd = () => {
    setShowAddForm((v) => !v);
    setError("");
    setEditingId(null);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Організації</h2>
        <button className={styles.btnPrimary} onClick={openAdd}>
          {showAddForm ? "✕ Скасувати" : "+ Додати організацію"}
        </button>
      </div>

      {showAddForm && (
        <OrgForm onSubmit={handleAdd} onCancel={openAdd} saving={saving} error={error} />
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th><Th>Назва</Th><Th>Тип</Th><Th>Місто</Th>
              <Th>Телефон</Th><Th>Email</Th><Th>Статус</Th><Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((o) => (
              <>
                <tr key={o.organization_id} className={styles.tr}>
                  <Td>{o.organization_id}</Td>
                  <Td>{o.name}</Td>
                  <Td>{o.type ?? "—"}</Td>
                  <Td>{o.city ?? "—"}</Td>
                  <Td>{o.phone_number ?? "—"}</Td>
                  <Td>{o.email}</Td>
                  <Td>
                    {isActive(o.status)
                      ? <BadgeGreen>Активна</BadgeGreen>
                      : <BadgeRed>Заблокована</BadgeRed>}
                  </Td>
                  <Td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btnSecondary}
                        onClick={() => openEdit(o.organization_id)}
                      >
                        {editingId === o.organization_id ? "✕" : "Редагувати"}
                      </button>
                      <button
                        className={isActive(o.status) ? styles.btnWarning : styles.btnPrimary}
                        onClick={() => handleToggleStatus(o.organization_id, o.status)}
                      >
                        {isActive(o.status) ? "Заблокувати" : "Активувати"}
                      </button>
                      <button
                        className={styles.btnDanger}
                        onClick={() => handleDelete(o.organization_id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </Td>
                </tr>
                {editingId === o.organization_id && (
                  <tr key={`edit-${o.organization_id}`}>
                    <td colSpan={8} style={{ padding: "0 16px 16px" }}>
                      <OrgForm
                        initial={{
                          name: o.name ?? "",
                          type: o.type ?? "Комунальна",
                          email: o.email ?? "",
                          phone_number: o.phone_number ?? "",
                          city: o.city ?? "",
                          street: o.street ?? "",
                          building: o.building ?? "",
                          edrpou: o.edrpou ?? "",
                          password: "",
                        }}
                        onSubmit={(form) => handleEdit(o.organization_id, form)}
                        onCancel={() => setEditingId(null)}
                        saving={saving}
                        error={error}
                        isEdit
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}