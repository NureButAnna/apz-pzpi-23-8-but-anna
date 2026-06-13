import styles from "../municipal.module.css";

const STATUS_MAP = {
  pending:   { label: "Очікує",    className: styles.badgeYellow },
  approved:  { label: "Схвалено",  className: styles.badgeGreen  },
  rejected:  { label: "Відхилено", className: styles.badgeRed    },
  completed: { label: "Виконано",  className: styles.badgeGreen  },
};

export default function RequestStatusBadge({ status }) {
  const { label, className } = STATUS_MAP[status] ?? {
    label: status,
    className: styles.badgeYellow,
  };
  return <span className={className}>{label}</span>;
}