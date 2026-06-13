import { useState } from "react";
import styles from "../admin.module.css";

const EMPTY_FORM = {
  name: "",
  type: "Комунальна",
  email: "",
  phone_number: "",
  city: "",
  street: "",
  building: "",
  edrpou: "",
  password: "",
};

const ORG_TYPES = ["Комунальна", "Приватна", "Державна", "Інше"];

export default function OrgForm({ initial = EMPTY_FORM, onSubmit, onCancel, saving, error, isEdit = false }) {
  const [form, setForm] = useState(initial);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className={styles.addForm}>
      <h3 className={styles.formTitle}>
        {isEdit ? "Редагувати організацію" : "Нова організація"}
      </h3>

      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>Назва</label>
          <input className={styles.input} name="name" placeholder="КП Харківводоканал"
            value={form.name} onChange={handleChange} required />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Тип</label>
          <select className={styles.input} name="type" value={form.type} onChange={handleChange}>
            {ORG_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} name="email" type="email" placeholder="org@example.com"
            value={form.email} onChange={handleChange} required />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>ЄДРПОУ</label>
          <input className={styles.input} name="edrpou" placeholder="12345678"
            value={form.edrpou} onChange={handleChange} required={!isEdit} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>Телефон</label>
          <input className={styles.input} name="phone_number" placeholder="+38 (050) 000-00-00"
            value={form.phone_number} onChange={handleChange} />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Місто</label>
          <input className={styles.input} name="city" placeholder="Харків"
            value={form.city} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>Вулиця</label>
          <input className={styles.input} name="street" placeholder="вул. Сумська"
            value={form.street} onChange={handleChange} />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Будинок</label>
          <input className={styles.input} name="building" placeholder="12"
            value={form.building} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>
            Пароль{" "}
            {isEdit && (
              <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                (залиште порожнім, щоб не змінювати)
              </span>
            )}
          </label>
          <input className={styles.input} name="password" type="password"
            placeholder={isEdit ? "Новий пароль (необов'язково)" : "Мінімум 6 символів"}
            value={form.password} onChange={handleChange} required={!isEdit} />
        </div>
        <div className={styles.formField} />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : isEdit ? "Зберегти зміни" : "Створити організацію"}
        </button>
        {onCancel && (
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}