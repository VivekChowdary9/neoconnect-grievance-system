import api from "./api";
import Cookies from "js-cookie";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  Cookies.set("token", res.data.token);
  Cookies.set("user", JSON.stringify(res.data.user));

  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/auth/register", data);

  return res.data;
};

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("user");

  window.location.href = "/login";
};