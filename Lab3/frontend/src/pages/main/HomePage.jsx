import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Solutions from "./components/Solutions";
import HowItWorks from "./components/HowItWorks";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("uk") ? "uk" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F7FBF8" }}>
      <Navbar scrolled={scrolled} lang={lang} />
      <Hero lang={lang} />
      <StatsBar lang={lang} />
      <Solutions lang={lang} />
      <HowItWorks lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}