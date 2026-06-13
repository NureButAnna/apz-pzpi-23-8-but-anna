export default function Contact({ lang }) {
  const isUk = lang === "uk";
  return (
    <section id="contact" style={{ padding: "96px 48px", background: "#F7FBF8" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 64, alignItems: "start",
      }}>
        <div>
          <span style={{
            display: "inline-block", background: "#E8F5E9", color: "#2E7D32",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", borderRadius: 20, padding: "4px 14px",
            marginBottom: 16,
          }}>
            {isUk ? "Контакти" : "Contact"}
          </span>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900,
            letterSpacing: "-1px", color: "#0D1F0D", marginBottom: 16,
          }}>
            {isUk ? "Є питання? Напишіть нам" : "Have questions? Write to us"}
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.65, marginBottom: 40 }}>
            {isUk
              ? "Ми відповімо протягом одного робочого дня."
              : "We respond within one business day."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "📧", label: "Email", value: "hello@ecofy.com.ua" },
              { icon: "📞", label: isUk ? "Телефон" : "Phone", value: "+38 (044) 123-45-67" },
              { icon: "📍", label: isUk ? "Адреса" : "Address", value: isUk ? "вул. Хрещатик, 1, Київ, 01001" : "1 Khreshchatyk St, Kyiv, 01001" },
              { icon: "🕐", label: isUk ? "Години роботи" : "Working hours", value: isUk ? "Пн–Пт, 09:00–18:00" : "Mon–Fri, 09:00–18:00" },
            ].map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, background: "#E8F5E9",
                  borderRadius: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 12, color: "#9CA3AF", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 15, color: "#111", fontWeight: 500, marginTop: 2 }}>
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 24, padding: 40,
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          border: "1px solid #E5F5EC",
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0D1F0D", marginBottom: 24 }}>
            {isUk ? "Надіслати повідомлення" : "Send a message"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { id: "name", label: isUk ? "Ім'я" : "Name", type: "text", placeholder: isUk ? "Ваше ім'я" : "Your name" },
              { id: "email", label: "Email", type: "email", placeholder: "name@company.com" },
            ].map((f) => (
              <div key={f.id}>
                <label style={{
                  display: "block", fontSize: 13, fontWeight: 600,
                  color: "#374151", marginBottom: 6,
                }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", border: "1.5px solid #E5E7EB",
                    borderRadius: 10, padding: "11px 14px", fontSize: 15,
                    outline: "none", background: "#FAFAFA",
                    boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{
                display: "block", fontSize: 13, fontWeight: 600,
                color: "#374151", marginBottom: 6,
              }}>
                {isUk ? "Повідомлення" : "Message"}
              </label>
              <textarea
                rows={4}
                placeholder={isUk ? "Опишіть ваше питання..." : "Describe your question..."}
                style={{
                  width: "100%", border: "1.5px solid #E5E7EB",
                  borderRadius: 10, padding: "11px 14px", fontSize: 15,
                  outline: "none", background: "#FAFAFA", resize: "vertical",
                  fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>
            <button style={{
              background: "#41B87A", color: "#fff", border: "none",
              borderRadius: 10, padding: "14px", fontSize: 16,
              fontWeight: 700, cursor: "pointer", width: "100%",
            }}>
              {isUk ? "Надіслати" : "Send message"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}