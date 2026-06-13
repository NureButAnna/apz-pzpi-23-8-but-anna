import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../../api/adminApi";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import { isActive } from "../../../utils/statusHelper";
import styles from "../admin.module.css";

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminApi.getUsers()
      .then((r) => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Видалити користувача?")) return;
    await adminApi.deleteUser(id);
    load();
  };

  const handleToggleStatus = async (id, current) => {
    await adminApi.updateUserStatus(id, !isActive(current));
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Користувачі</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Ім'я</Th>
              <Th>Email</Th>
              <Th>Місто</Th>
              <Th>Статус</Th>
              <Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className={styles.tr}>
                <Td>{u.user_id}</Td>
                <Td>{u.first_name} {u.last_name}</Td>
                <Td>{u.email}</Td>
                <Td>{u.city_id ?? "—"}</Td>
                <Td>
                  {isActive(u.status)
                    ? <BadgeGreen>Активний</BadgeGreen>
                    : <BadgeRed>Заблокований</BadgeRed>}
                </Td>
                <Td>
                  <div className={styles.actions}>
                    <button
                      className={isActive(u.status) ? styles.btnWarning : styles.btnPrimary}
                      onClick={() => handleToggleStatus(u.user_id, u.status)}
                    >
                      {isActive(u.status) ? "Заблокувати" : "Активувати"}
                    </button>
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(u.user_id)}
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