export default function StatsBar({ lang }) {
  const isUk = lang === "uk";
  const stats = [
    { value: "50+", label: isUk ? "міст України" : "cities" },
    { value: "1 200+", label: isUk ? "майданчиків" : "collection sites" },
    { value: "15 000+", label: isUk ? "активних користувачів" : "active users" },
    { value: "98%", label: isUk ? "задоволених клієнтів" : "satisfaction rate" },
  ];
  return (
    <section style={{
      background: "#fff",
      borderTop: "1px solid #E5F5EC",
      borderBottom: "1px solid #E5F5EC",
      padding: "40px 48px",
      display: "flex", justifyContent: "center",
      gap: 64, flexWrap: "wrap",
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#41B87A", letterSpacing: "-1px" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 500 }}>
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}