import { Link } from "react-router-dom";
import LangToggle from "../../../components/common/LanguageSwitcher";

export default function Navbar({ scrolled, lang }) {
  const isUk = lang === "uk";
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 48px",
      background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.07)" : "none",
      transition: "all 0.3s",
    }}>
      <span style={{ fontSize: 20, fontWeight: 900, color: "#1A2E1A", letterSpacing: "-0.5px" }}>
        🌿 Ecofy
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="#solutions" style={navLink}>
          {isUk ? "Рішення" : "Solutions"}
        </a>
        <a href="#contact" style={navLink}>
          {isUk ? "Контакти" : "Contact"}
        </a>
        <LangToggle />
        <Link to="/login" style={{
          background: "#1A2E1A", color: "#fff", borderRadius: 10,
          padding: "9px 22px", fontSize: 14, fontWeight: 700,
          textDecoration: "none",
        }}>
          {isUk ? "Увійти" : "Sign in"}
        </Link>
      </div>
    </nav>
  );
}

const navLink = {
  color: "#374151", textDecoration: "none",
  fontSize: 14, fontWeight: 500, opacity: 0.8,
};