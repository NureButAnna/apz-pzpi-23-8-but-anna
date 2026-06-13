import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const companyApi = {
  // Профіль
  getProfile: (clientId) =>
    axios.get(`${API}/client-companies/${clientId}`, { headers: headers() }),

  updateProfile: (clientId, data) =>
    axios.put(`${API}/client-companies/${clientId}`, data, { headers: headers() }),

  // Заявки
  getRequests: () =>
    axios.get(`${API}/requests/`, { headers: headers() }),

  createRequest: (data) =>
    axios.post(`${API}/requests/`, data, { headers: headers() }),

  deleteRequest: (id) =>
    axios.delete(`${API}/requests/${id}`, { headers: headers() }),

  // Статистика
  getStatistics: (dateFrom, dateTo) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    return axios.get(`${API}/requests/statistics?${params}`, { headers: headers() });
  },

  // Організації (для форми заявки)
  getOrganizations: () =>
    axios.get(`${API}/organizations/`, { headers: headers() }),
};