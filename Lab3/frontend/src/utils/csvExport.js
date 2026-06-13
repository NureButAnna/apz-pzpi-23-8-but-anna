const COLUMN_LABELS = {
  // Users
  user_id: "ID",
  first_name: "Ім'я",
  last_name: "Прізвище",
  patronymic: "По батькові",
  email: "Email",
  phone_number: "Телефон",
  city_id: "ID міста",
  created_at: "Дата реєстрації",
  status: "Статус",
  // Organizations / Companies
  organization_id: "ID",
  client_id: "ID",
  name: "Назва",
  type: "Тип",
  city: "Місто",
  street: "Вулиця",
  building: "Будинок",
  edrpou: "ЄДРПОУ",
  // Sites
  container_site_id: "ID майданчика",
  location_lat: "Широта",
  location_lng: "Довгота",
  entrance: "Під'їзд",
  description: "Опис",
  // Containers
  container_id: "ID",
  capacity: "Місткість (л)",
  fill_level: "Заповнення %",
  last_update: "Оновлено",
  // Tips
  tip_id: "ID",
  title: "Заголовок",
  content: "Текст",
  category: "Категорія",
  is_published: "Опубліковано",
};

/**
 * Форматує одне значення поля для CSV.
 * @param {string} key  — назва поля
 * @param {*}      value — значення
 * @returns {string}
 */
const formatValue = (key, value) => {
  if (value === null || value === undefined) return "";
  if (key === "status")
    return value === true || value === "true" || value === "active"
      ? "Активний"
      : "Заблокований";
  if (key === "is_published") return value ? "Так" : "Ні";
  return String(value);
};

/**
 * Генерує та завантажує CSV-файл.
 *
 * @param {Object[]} data      — масив об'єктів
 * @param {string}   filename  — ім'я файлу (напр. "users.csv")
 * @param {Object}   [labels]  — додаткові або замінні мітки колонок
 *
 * @example
 * downloadCSV(users, "users.csv");
 * downloadCSV(report, "report.csv", { custom_field: "Моє поле" });
 */
export const downloadCSV = (data, filename, labels = {}) => {
  if (!data.length) return;

  const mergedLabels = { ...COLUMN_LABELS, ...labels };
  const keys = Object.keys(data[0]);
  const headers = keys.map((k) => mergedLabels[k] ?? k);

  const rows = data.map((row) =>
    keys
      .map((k) => `"${formatValue(k, row[k]).replace(/"/g, '""')}"`)
      .join(",")
  );

  const BOM = "\uFEFF";
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};