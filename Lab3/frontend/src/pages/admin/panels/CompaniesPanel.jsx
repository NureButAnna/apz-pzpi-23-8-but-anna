import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import { adminApi } from "../../../api/adminApi";
import { isActive } from "../../../utils/statusHelper";
import styles from "../admin.module.css";

export default function CompaniesPanel() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminApi.getCompanies()
      .then((r) => setCompanies(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Видалити компанію?")) return;
    await adminApi.deleteCompany(id);
    load();
  };

  const handleToggleStatus = async (id, current) => {
    await adminApi.updateCompanyStatus(id, !isActive(current));
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Компанії-клієнти</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th><Th>Назва</Th><Th>Тип</Th><Th>ЄДРПОУ</Th>
              <Th>Місто</Th><Th>Телефон</Th><Th>Email</Th><Th>Статус</Th><Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.client_id} className={styles.tr}>
                <Td>{c.client_id}</Td>
                <Td>{c.name}</Td>
                <Td>{c.type ?? "—"}</Td>
                <Td>{c.edrpou ?? "—"}</Td>
                <Td>{c.city ?? "—"}</Td>
                <Td>{c.phone_number ?? "—"}</Td>
                <Td>{c.email}</Td>
                <Td>
                  {isActive(c.status)
                    ? <BadgeGreen>Активна</BadgeGreen>
                    : <BadgeRed>Заблокована</BadgeRed>}
                </Td>
                <Td>
                  <div className={styles.actions}>
                    <button
                      className={isActive(c.status) ? styles.btnWarning : styles.btnPrimary}
                      onClick={() => handleToggleStatus(c.client_id, c.status)}
                    >
                      {isActive(c.status) ? "Заблокувати" : "Активувати"}
                    </button>
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(c.client_id)}
                    >
                      Видалити
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