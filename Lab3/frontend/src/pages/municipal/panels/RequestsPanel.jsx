import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Th, Td, Loader } from "../components/MunicipalTable";
import { municipalApi } from "../../../api/municipalApi";
import RequestStatusBadge from "../components/RequestStatusBadge";
import styles from "../municipal.module.css";

export default function RequestsPanel() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    municipalApi.getRequests()
      .then((r) => setRequests(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    setError("");
    setUpdatingId(id);
    try {
      await municipalApi.updateRequestStatus(id, status);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : t("common.error"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    try {
      await municipalApi.deleteRequest(id);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : t("common.error"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{t("municipal.requestsFromCompanies")}</h2>
      </div>

      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>{t("common.id")}</Th>
              <Th>{t("common.name")}</Th>
              <Th>{t("municipal.wasteType")}</Th>
              <Th>{t("municipal.wasteDesc")}</Th>
              <Th>{t("municipal.amountKg")}</Th>
              <Th>{t("common.status")}</Th>
              <Th>{t("common.actions")}</Th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.td} style={{ textAlign: "center", color: "#9CA3AF" }}>
                  {t("municipal.noRequests")}
                </td>
              </tr>
            ) : requests.map((r) => (
              <tr key={r.request_id} className={styles.tr}>
                <Td>{r.request_id}</Td>
                <Td>{r.client_id ?? "—"}</Td>
                <Td>{r.waste_type}</Td>
                <Td>{r.waste_description ?? "—"}</Td>
                <Td>{r.amount_kg ?? "—"}</Td>
                <Td><RequestStatusBadge status={r.status} /></Td>
                <Td>
                  <div className={styles.actions}>
                    {r.status === "pending" && (
                      <>
                        <button className={styles.btnSuccess}
                          disabled={updatingId === r.request_id}
                          onClick={() => handleStatusChange(r.request_id, "approved")}>
                          {t("municipal.approve")}
                        </button>
                        <button className={styles.btnWarning}
                          disabled={updatingId === r.request_id}
                          onClick={() => handleStatusChange(r.request_id, "rejected")}>
                          {t("municipal.reject")}
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <button className={styles.btnSuccess}
                        disabled={updatingId === r.request_id}
                        onClick={() => handleStatusChange(r.request_id, "completed")}>
                        ✓ {t("municipal.complete")}
                      </button>
                    )}
                    <button className={styles.btnDanger} onClick={() => handleDelete(r.request_id)}>
                      {t("common.delete")}
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}