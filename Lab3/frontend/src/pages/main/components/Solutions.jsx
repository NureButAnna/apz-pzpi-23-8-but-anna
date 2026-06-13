import { Link } from "react-router-dom";

export default function Solutions({ lang }) {
  const isUk = lang === "uk";

  const cards = [
    {
      icon: "👤",
      eyebrow: isUk ? "Для мешканців" : "For residents",
      title: isUk ? "Знайди найближчий пункт прийому" : "Find your nearest collection point",
      desc: isUk
        ? "Переглядай рівень заповнення контейнерів у реальному часі, отримуй поради з сортування та сповіщення про вивіз."
        : "See real-time fill levels, get sorting tips, and receive pickup notifications.",
      features: isUk
        ? ["Карта найближчих майданчиків", "Поради з сортування відходів", "Сповіщення про вивіз"]
        : ["Map of nearby sites", "Waste sorting tips", "Pickup notifications"],
      cta: isUk ? "Зареєструватись" : "Sign up",
      to: "/register",
      accent: "#41B87A",
      bg: "#F0FAF4",
    },
    {
      icon: "🏛️",
      eyebrow: isUk ? "Для муніципальних служб" : "For municipalities",
      title: isUk ? "Керуй інфраструктурою міста" : "Manage city infrastructure",
      desc: isUk
        ? "Моніторинг заповнення контейнерів, планування маршрутів вивозу, IoT-телеметрія та аналітичні звіти."
        : "Monitor container fill levels, plan pickup routes, IoT telemetry and analytics.",
      features: isUk
        ? ["Дашборд в реальному часі", "Планування вивозів", "Аналітика та звіти"]
        : ["Real-time dashboard", "Pickup scheduling", "Analytics & reports"],
      cta: isUk ? "Отримати доступ" : "Get access",
      to: "/login",
      accent: "#2196F3",
      bg: "#EFF6FF",
    },
    {
      icon: "🏭",
      eyebrow: isUk ? "Для підприємств" : "For businesses",
      title: isUk ? "Замовляй вивіз вторсировини" : "Order waste collection",
      desc: isUk
        ? "Подавай заявки на вивіз вторинної сировини, відстежуй статус та отримуй документи для звітності."
        : "Submit waste collection requests, track status and get reporting documentation.",
      features: isUk
        ? ["Заявки на вивіз онлайн", "Статистика зданих відходів", "Документи для звітності"]
        : ["Online collection requests", "Waste submission stats", "Reporting documentation"],
      cta: isUk ? "Зареєструвати компанію" : "Register company",
      to: "/register-company",
      accent: "#F39C12",
      bg: "#FFFBEB",
    },
  ];

  return (
    <section id="solutions" style={{ padding: "96px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <span style={{
          display: "inline-block", background: "#E8F5E9", color: "#2E7D32",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", borderRadius: 20, padding: "4px 14px",
          marginBottom: 16,
        }}>
          {isUk ? "Рішення" : "Solutions"}
        </span>
        <h2 style={{
          fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900,
          letterSpacing: "-1.5px", color: "#0D1F0D", margin: 0,
        }}>
          {isUk ? "Платформа для кожного" : "A platform for everyone"}
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
      }}>
        {cards.map((c) => (
          <div key={c.eyebrow} style={{
            background: c.bg, borderRadius: 24, padding: 32,
            border: `1px solid ${c.accent}22`,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: c.accent, marginBottom: 8,
            }}>
              {c.eyebrow}
            </span>
            <h3 style={{
              fontSize: 22, fontWeight: 800, color: "#0D1F0D",
              letterSpacing: "-0.3px", marginBottom: 12, lineHeight: 1.25,
            }}>
              {c.title}
            </h3>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, marginBottom: 24 }}>
              {c.desc}
            </p>
            <ul style={{
              listStyle: "none", padding: 0, margin: "0 0 32px",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {c.features.map((f) => (
                <li key={f} style={{
                  display: "flex", alignItems: "center",
                  gap: 8, fontSize: 14, color: "#374151",
                }}>
                  <span style={{ color: c.accent, fontWeight: 700, fontSize: 16 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to={c.to} style={{
              display: "inline-block", background: c.accent, color: "#fff",
              borderRadius: 10, padding: "12px 24px", fontSize: 15,
              fontWeight: 700, textDecoration: "none", textAlign: "center",
              marginTop: "auto",
            }}>
              {c.cta} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}