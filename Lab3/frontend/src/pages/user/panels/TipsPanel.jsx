import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader } from "../components/UserTable";
import styles from "../user.module.css";

const API = "https://ecofy-beta.vercel.app";

const CATEGORY_COLORS = {
  "Пластик": "#2196F3",
  "Скло": "#41B87A",
  "Папір": "#F39C12",
  "Метал": "#9C27B0",
  "Електроніка": "#F44336",
};

export default function TipsPanel() {
  const [tips, setTips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    Promise.all([
      axios.get(`${API}/tips/`),
      axios.get(`${API}/tips/categories`),
    ])
      .then(([tipsRes, catRes]) => {
        setTips(tipsRes.data);
        setCategories(["Всі", ...catRes.data]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = activeCategory === "Всі"
    ? tips
    : tips.filter((t) => t.category === activeCategory);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Поради з сортування</h2>

      {/* Категорії */}
      <div className={styles.filterRow}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryBtnActive : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
          Порад поки немає
        </div>
      ) : filtered.map((tip) => {
        const color = CATEGORY_COLORS[tip.category] || "#41B87A";
        return (
          <div
            key={tip.tip_id}
            className={styles.tipCard}
            style={{ borderLeftColor: color }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0D1F0D", margin: 0 }}>
                {tip.title}
              </h3>
              {tip.category && (
                <span style={{
                  background: `${color}22`, color,
                  fontSize: 11, fontWeight: 700,
                  borderRadius: 6, padding: "3px 10px",
                  flexShrink: 0, marginLeft: 12,
                }}>
                  {tip.category}
                </span>
              )}
            </div>
            {tip.content && (
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                {tip.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}