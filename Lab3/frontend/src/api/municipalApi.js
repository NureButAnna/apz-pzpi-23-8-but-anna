import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const municipalApi = {
  // Огляд
  getPickupStats: () =>
    axios.get(`${API}/pickups/statistics`, { headers: headers() }),

  getSites: () =>
    axios.get(`${API}/container-sites/`, { headers: headers() }),

  // Контейнери
  getContainers: () =>
    axios.get(`${API}/containers/`, { headers: headers() }),

  createContainer: (data) =>
    axios.post(`${API}/containers/`, data, { headers: headers() }),

  deleteContainer: (id) =>
    axios.delete(`${API}/containers/${id}`, { headers: headers() }),

  // Пристрої
  getDevices: () =>
    axios.get(`${API}/devices/`, { headers: headers() }),

  createDevice: (data) =>
    axios.post(`${API}/devices/`, data, { headers: headers() }),

  // Вивози
  getPickups: () =>
    axios.get(`${API}/pickups/`, { headers: headers() }),

  createPickup: (data) =>
    axios.post(`${API}/pickups/`, data, { headers: headers() }),

  completePickup: (id) =>
    axios.put(`${API}/pickups/${id}`, { completed_time: new Date().toISOString() }, { headers: headers() }),

  deletePickup: (id) =>
    axios.delete(`${API}/pickups/${id}`, { headers: headers() }),

  // Статистика
  getPickupStatistics: (dateFrom, dateTo) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    return axios.get(`${API}/pickups/statistics?${params}`, { headers: headers() });
  },

  // Заявки від компаній
  getRequests: () =>
    axios.get(`${API}/requests/`, { headers: headers() }),

  updateRequestStatus: (id, status) =>
    axios.put(`${API}/requests/${id}/status?status=${status}`, {}, { headers: headers() }),

  deleteRequest: (id) =>
    axios.delete(`${API}/requests/${id}`, { headers: headers() }),
};
