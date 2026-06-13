import { Link } from "react-router-dom";

export default function Hero({ lang }) {
  const isUk = lang === "uk";
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 48px 80px",
      background: "linear-gradient(135deg, #F0FAF4 0%, #E8F5E9 60%, #F7FBF8 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "10%", right: "5%",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(65,184,122,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "10%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(65,184,122,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1100, margin: "0 auto", width: "100%",
        display: "flex", alignItems: "center", gap: 64,
      }}>
        <div style={{ flex: 1 }}>
          <span style={{
            display: "inline-block", background: "#E8F5E9", color: "#2E7D32",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", borderRadius: 20, padding: "4px 14px",
            marginBottom: 20,
          }}>
            {isUk ? "Розумне сортування відходів" : "Smart waste management"}
          </span>
          <h1 style={{
            fontSize: "clamp(44px, 5.5vw, 76px)", fontWeight: 900,
            lineHeight: 1.02, letterSpacing: "-2.5px",
            color: "#0D1F0D", margin: "0 0 24px",
          }}>
            {isUk ? (
              <>Переробляй<br /><span style={{ color: "#41B87A" }}>розумно.</span><br />Живи краще.</>
            ) : (
              <>Recycle<br /><span style={{ color: "#41B87A" }}>smarter.</span><br />Live better.</>
            )}
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.7, color: "#4B5563",
            maxWidth: 480, marginBottom: 40,
          }}>
            {isUk
              ? "Ecofy з'єднує мешканців, муніципальні служби та підприємства — для чистіших міст і прозорого обліку відходів."
              : "Ecofy connects residents, municipalities and businesses — for cleaner cities and transparent waste tracking."}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/register" style={{
              background: "#41B87A", color: "#fff", borderRadius: 12,
              padding: "15px 34px", fontSize: 16, fontWeight: 700,
              textDecoration: "none", boxShadow: "0 4px 20px rgba(65,184,122,0.3)",
            }}>
              {isUk ? "Почати безкоштовно" : "Get started free"}
            </Link>
            <a href="#solutions" style={{
              background: "#fff", color: "#1A2E1A",
              border: "1.5px solid #D1D5DB", borderRadius: 12,
              padding: "15px 34px", fontSize: 16, fontWeight: 600,
              textDecoration: "none",
            }}>
              {isUk ? "Дізнатися більше" : "Learn more"} ↓
            </a>
          </div>
        </div>

        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "20px 24px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            border: "1px solid #E5F5EC", width: 280,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#9CA3AF",
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
            }}>
              {isUk ? "Майданчик • вул. Сумська, 12" : "Site • Sumska St, 12"}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["Скло", "Папір", "Пластик"].map((t) => (
                <span key={t} style={{
                  background: "#E8F5E9", color: "#41B87A",
                  fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 10px",
                }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {isUk ? "Заповнення" : "Fill level"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F39C12" }}>45%</span>
            </div>
            <div style={{ background: "#F0F0F0", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ width: "45%", height: "100%", background: "#F39C12", borderRadius: 99 }} />
            </div>
          </div>

          <div style={{
            background: "#1A2E1A", borderRadius: 20,
            padding: "20px 24px", width: 280, color: "#fff",
          }}>
            <div style={{
              fontSize: 12, color: "#86EFAC", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
            }}>
              {isUk ? "Сьогодні вивезено" : "Collected today"}
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>
              1.2т
            </div>
            <div style={{ fontSize: 13, color: "#86EFAC" }}>
              +18% {isUk ? "порівняно з вчора" : "vs yesterday"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}