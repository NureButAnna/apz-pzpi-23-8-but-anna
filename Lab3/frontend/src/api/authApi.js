import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

export const authApi = {
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email); // OAuth2PasswordRequestForm очікує "username"
    formData.append("password", password);

    return axios.post(`${API}/auth/login`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  register: (data) =>
    axios.post(`${API}/users/register`, data),
};