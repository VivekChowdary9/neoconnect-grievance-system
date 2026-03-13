import api from "./api";
import Cookies from "js-cookie";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    Cookies.set("token", data.token, { expires: 7 });
    Cookies.set("user", JSON.stringify(data), { expires: 7 });
    return data;
  },

  async register(userData) {
    const { data } = await api.post("/auth/register", userData);
    Cookies.set("token", data.token, { expires: 7 });
    Cookies.set("user", JSON.stringify(data), { expires: 7 });
    return data;
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  logout() {
    Cookies.remove("token");
    Cookies.remove("user");
  },

  getCurrentUser() {
    try {
      const user = Cookies.get("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!Cookies.get("token");
  },
};
