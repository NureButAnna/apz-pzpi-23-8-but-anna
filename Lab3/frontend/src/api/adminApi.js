import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const adminApi = {
  // Users
  getUsers: () => axios.get(`${API}/admin/users`, { headers: headers() }),
  deleteUser: (id) => axios.delete(`${API}/admin/users/${id}`, { headers: headers() }),
  updateUserStatus: (id, status) =>
    axios.patch(`${API}/admin/users/${id}/status`, { status }, { headers: headers() }),

  // Organizations
  getOrganizations: () =>
    axios.get(`${API}/organizations`, { headers: headers() }),
  createOrganization: (data) =>
    axios.post(`${API}/admin/organizations`, data, { headers: headers() }),
  updateOrganization: (id, data) =>
    axios.put(`${API}/organizations/${id}`, data, { headers: headers() }),
  deleteOrganization: (id) =>
    axios.delete(`${API}/admin/organizations/${id}`, { headers: headers() }),
  updateOrgStatus: (id, status) =>
    axios.patch(`${API}/admin/organizations/${id}/status`, { status }, { headers: headers() }),

  // Client Companies
  getCompanies: () =>
    axios.get(`${API}/admin/client-companies`, { headers: headers() }),
  deleteCompany: (id) =>
    axios.delete(`${API}/admin/client-companies/${id}`, { headers: headers() }),
  updateCompanyStatus: (id, status) =>
    axios.patch(`${API}/admin/client-companies/${id}/status`, { status }, { headers: headers() }),

  // Sites
  getSites: () =>
    axios.get(`${API}/container-sites/`, { headers: headers() }),
  createSite: (data) =>
    axios.post(`${API}/container-sites/`, data, { headers: headers() }),
  deleteSite: (id) =>
    axios.delete(`${API}/container-sites/${id}`, { headers: headers() }),

  // Containers
  getContainers: () =>
    axios.get(`${API}/containers/`, { headers: headers() }),
  createContainer: (data) =>
    axios.post(`${API}/containers/`, data, { headers: headers() }),
  deleteContainer: (id) =>
    axios.delete(`${API}/containers/${id}`, { headers: headers() }),

  // Tips
  getTips: () => axios.get(`${API}/tips/`, { headers: headers() }),
  createTip: (data) =>
    axios.post(`${API}/tips/`, data, { headers: headers() }),
  deleteTip: (id) =>
    axios.delete(`${API}/tips/${id}`, { headers: headers() }),

};