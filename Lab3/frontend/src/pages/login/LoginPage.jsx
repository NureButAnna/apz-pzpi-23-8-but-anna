import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import styles from "./login.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);

      const payload = JSON.parse(atob(access_token.split(".")[1]));
      localStorage.setItem("user_id", payload.sub);
      localStorage.setItem("role", payload.role);

      switch (payload.role) {
        case "admin":
          navigate("/admin");
          break;
        case "organization":
          navigate("/municipal");
          break;
        case "client_company":
          navigate("/company");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Невірний email або пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>
          ← На головну
        </Link>
        <div className={styles.logo}>🌿 Ecofy</div>
        <h1 className={styles.title}>Вхід</h1>
        <p className={styles.sub}>Раді бачити тебе знову</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className={styles.label}>Пароль</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>

        <p className={styles.footer}>
          Немає акаунта?{" "}
          <Link to="/register" className={styles.link}>
            Зареєструватись
          </Link>
        </p>
        <p className={styles.footer}>
          Реєстрація компанії?{" "}
          <Link to="/register-company" className={styles.link}>
            Бізнес акаунт
          </Link>
        </p>
      </div>
    </div>
  );
}