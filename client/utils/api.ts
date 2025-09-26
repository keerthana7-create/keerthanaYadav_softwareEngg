import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        if (data?.accessToken) {
          localStorage.setItem("access_token", data.accessToken);
          original.headers = original.headers ?? {};
          original.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return api(original);
        }
      } catch (_) {
        localStorage.removeItem("access_token");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
