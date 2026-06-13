export default function Footer({ lang }) {
  const isUk = lang === "uk";
  return (
    <footer style={{ background: "#0D1F0D", color: "#fff", padding: "48px 48px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#41B87A", marginBottom: 8 }}>
              🌿 Ecofy
            </div>
            <div style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 220, lineHeight: 1.6 }}>
              {isUk
                ? "Платформа для розумного управління відходами в Україні."
                : "Smart waste management platform for Ukraine."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "#41B87A",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
              }}>
                {isUk ? "Платформа" : "Platform"}
              </div>
              {(isUk
                ? ["Для мешканців", "Муніципалітетам", "Підприємствам"]
                : ["For residents", "For municipalities", "For businesses"]
              ).map((l) => (
                <div key={l} style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 8 }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "#41B87A",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
              }}>
                {isUk ? "Компанія" : "Company"}
              </div>
              {(isUk
                ? ["Про нас", "Контакти", "Конфіденційність"]
                : ["About", "Contact", "Privacy"]
              ).map((l) => (
                <div key={l} style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 8 }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>🌿 Ecofy © 2026</span>
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {isUk ? "Разом — чистіше майбутнє" : "Together — a cleaner future"}
          </span>
        </div>
      </div>
    </footer>
  );
}