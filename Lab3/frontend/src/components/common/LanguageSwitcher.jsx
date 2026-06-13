import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      style={{
        background: "none",
        border: "1.5px solid #41B87A",
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 700,
        color: "#41B87A",
        cursor: "pointer",
      }}
    >
      {i18n.language === "uk" ? "EN" : "УК"}
    </button>
  );
}