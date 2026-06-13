import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./login/login.module.css";

const API = "https://ecofy-beta.vercel.app";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Паролі не співпадають");
      return;
    }
    if (form.password.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/users/register`, {
        first_name: form.first_name,
        last_name: "",
        email: form.email,
        password: form.password,
      });

      navigate("/login", { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(
        typeof msg === "string" ? msg : "Помилка реєстрації. Спробуй ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.logo}>🌿 Ecofy</div>
        <h1 className={styles.title}>Реєстрація</h1>
        <p className={styles.sub}>Створи акаунт та починай сортувати</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Ім'я</label>
          <input
            className={styles.input}
            type="text"
            name="first_name"
            placeholder="Твоє ім'я"
            value={form.first_name}
            onChange={handleChange}
            required
          />

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
            placeholder="Мінімум 6 символів"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label className={styles.label}>Підтвердіть пароль</label>
          <input
            className={styles.input}
            type="password"
            name="confirm_password"
            placeholder="Повторіть пароль"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Завантаження..." : "Зареєструватись"}
          </button>
        </form>

        <p className={styles.footer}>
          Вже є акаунт?{" "}
          <Link to="/login" className={styles.link}>
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}