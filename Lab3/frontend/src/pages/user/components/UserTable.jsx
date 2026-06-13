import styles from "../user.module.css";

export const Th = ({ children }) => <th className={styles.th}>{children}</th>;
export const Td = ({ children }) => <td className={styles.td}>{children}</td>;
export const Loader = () => <div className={styles.loader}>Завантаження...</div>;
export const BadgeGreen = ({ children }) => <span className={styles.badgeGreen}>{children}</span>;
export const BadgeRed = ({ children }) => <span className={styles.badgeRed}>{children}</span>;
export const BadgeYellow = ({ children }) => <span className={styles.badgeYellow}>{children}</span>;
export const StatCard = ({ icon, value, label, color }) => (
  <div className={styles.statCard}>
    <span className={styles.statIcon}>{icon}</span>
    <span className={styles.statValue} style={{ color }}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
  </div>
);