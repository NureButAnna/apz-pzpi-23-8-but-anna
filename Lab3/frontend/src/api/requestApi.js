import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const requestsApi = {
  getAll: () =>
    axios.get(`${API}/requests/`, { headers: headers() }),

  updateStatus: (id, status) =>
    axios.put(`${API}/requests/${id}/status?status=${status}`, {}, { headers: headers() }),

  delete: (id) =>
    axios.delete(`${API}/requests/${id}`, { headers: headers() }),
};