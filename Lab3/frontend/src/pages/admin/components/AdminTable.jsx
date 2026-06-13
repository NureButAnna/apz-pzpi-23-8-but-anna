import styles from "../admin.module.css";

export const Th = ({ children }) => (
  <th className={styles.th}>{children}</th>
);

export const Td = ({ children, className }) => (
  <td className={`${styles.td} ${className ?? ""}`}>{children}</td>
);

export const Loader = () => (
  <div className={styles.loader}>Завантаження...</div>
);

export const BadgeGreen = ({ children }) => (
  <span className={styles.badgeGreen}>{children}</span>
);

export const BadgeRed = ({ children }) => (
  <span className={styles.badgeRed}>{children}</span>
);

export const BadgeYellow = ({ children }) => (
  <span className={styles.badgeYellow}>{children}</span>
);