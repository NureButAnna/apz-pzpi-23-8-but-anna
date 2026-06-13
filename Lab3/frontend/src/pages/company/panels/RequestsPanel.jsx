import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Th, Td, Loader, BadgeGreen, BadgeRed, BadgeYellow } from "../components/CompanyTable";
import { companyApi } from "../../../api/companyApi";
import styles from "../company.module.css";

const WASTE_TYPES = ["Пластик", "Скло", "Папір", "Метал", "Електроніка", "Інше"];

const EMPTY_FORM = {
  waste_type: "Пластик",
  waste_description: "",
  amount_kg: "",
  organization_id: "",
};

export default function RequestsPanel() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const getStatusBadge = (status) => {
    const labels = {
      pending:   t("company.statusPending"),
      approved:  t("company.statusApproved"),
      rejected:  t("company.statusRejected"),
      completed: t("company.statusCompleted"),
    };
    const label = labels[status] ?? status;
    if (status === "approved" || status === "completed") return <BadgeGreen>{label}</BadgeGreen>;
    if (status === "rejected") return <BadgeRed>{label}</BadgeRed>;
    return <BadgeYellow>{label}</BadgeYellow>;
  };

  const load = useCallback(() => {
    Promise.all([companyApi.getRequests(), companyApi.getOrganizations()])
      .then(([reqRes, orgRes]) => {
        setRequests(reqRes.data);
        setOrganizations(orgRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await companyApi.createRequest({
        waste_type:        form.waste_type,
        waste_description: form.waste_description || null,
        amount_kg:         Number(form.amount_kg),
        organization_id:   Number(form.organization_id),
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    try {
      await companyApi.deleteRequest(id);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : t("common.error"));
    }
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>{t("company.requestsTitle")}</h2>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h3 className={styles.formTitle}>{t("company.newRequest")}</h3>
        {error && <div style={{ color: "#DC2626", fontSize: 14 }}>{error}</div>}
        <div className={styles.formRow}>
          <select className={styles.input} value={form.waste_type}
            onChange={(e) => setForm({ ...form, waste_type: e.target.value })}>
            {WASTE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input className={styles.input} type="number" placeholder={t("company.amountKg")}
            value={form.amount_kg} min="1" required
            onChange={(e) => setForm({ ...form, amount_kg: e.target.value })} />
          <select className={styles.input} value={form.organization_id} required
            onChange={(e) => setForm({ ...form, organization_id: e.target.value })}>
            <option value="">{t("company.chooseOrg")}</option>
            {organizations.map((o) => (
              <option key={o.organization_id} value={o.organization_id}>{o.name}</option>
            ))}
          </select>
        </div>
        <textarea className={styles.input} placeholder={t("company.descOptional")}
          value={form.waste_description} rows={2} style={{ resize: "vertical" }}
          onChange={(e) => setForm({ ...form, waste_description: e.target.value })} />
        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? t("common.loading") : t("company.submit")}
        </button>
      </form>

      {loading ? <Loader /> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>{t("common.id")}</Th>
              <Th>{t("company.wasteType")}</Th>
              <Th>{t("company.amountKg")}</Th>
              <Th>{t("company.organization")}</Th>
              <Th>{t("common.status")}</Th>
              <Th>{t("common.actions")}</Th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                {t("company.noRequests")}
              </td></tr>
            ) : requests.map((r) => (
              <tr key={r.request_id} className={styles.tr}>
                <Td>{r.request_id}</Td>
                <Td><span className={styles.badgeGreen}>{r.waste_type}</span></Td>
                <Td>{r.amount_kg} кг</Td>
                <Td>{r.organization_id}</Td>
                <Td>{getStatusBadge(r.status)}</Td>
                <Td>
                  {r.status === "pending" && (
                    <button className={styles.btnDanger} onClick={() => handleDelete(r.request_id)}>
                      {t("company.cancel")}
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}