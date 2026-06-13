import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const userApi = {
  getUser: (id) =>
    axios.get(`${API}/users/${id}`, { headers: headers() }),

  updateUser: (id, data) =>
    axios.put(`${API}/users/${id}`, data, { headers: headers() }),

  getContainerSites: () =>
    axios.get(`${API}/users/container-sites`, { headers: headers() }),

  getContainersStatus: () =>
    axios.get(`${API}/users/containers/status`, { headers: headers() }),

  getCollectionNotifications: () =>
    axios.get(`${API}/users/notifications/collection`, { headers: headers() }),

  getSiteNotifications: () =>
    axios.get(`${API}/users/notifications/container-sites`, { headers: headers() }),

  searchCities: (query) =>
  axios.get(`${API}/cities/search`, { params: { query } }),

  updateCity: (userId, cityId) =>
    axios.patch(
      `${API}/users/${userId}/city`,
      { city_id: cityId },
      { headers: headers() }
    ),
};

