export default function HowItWorks({ lang }) {
  const isUk = lang === "uk";
  const steps = isUk
    ? [
        { n: "01", title: "Зареєструйся", desc: "Створи акаунт за 1 хвилину. Обери роль: мешканець, муніципалітет або підприємство." },
        { n: "02", title: "Обери місто", desc: "Вкажи своє місто і отримай доступ до всіх майданчиків у твоєму районі." },
        { n: "03", title: "Дій", desc: "Здавай відходи, плануй вивіз або моніторь контейнери — залежно від твоєї ролі." },
      ]
    : [
        { n: "01", title: "Sign up", desc: "Create an account in 1 minute. Choose your role: resident, municipality, or business." },
        { n: "02", title: "Select your city", desc: "Enter your city and get access to all collection sites in your area." },
        { n: "03", title: "Take action", desc: "Drop off waste, schedule pickups, or monitor containers — depending on your role." },
      ];

  return (
    <section style={{ background: "#0D1F0D", padding: "96px 48px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900,
          color: "#fff", letterSpacing: "-1px",
          marginBottom: 56, textAlign: "center",
        }}>
          {isUk ? "Як це працює" : "How it works"}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}>
          {steps.map((s) => (
            <div key={s.n}>
              <div style={{
                fontSize: 48, fontWeight: 900, color: "#41B87A",
                opacity: 0.4, letterSpacing: "-2px", marginBottom: 12,
              }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.65 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}