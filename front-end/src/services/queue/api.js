import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // altere para a porta da sua API
});

api.interceptors.request.use((config) => {
  const tokenRaw = localStorage.getItem("token");
  const token = JSON.parse(tokenRaw);

  if (token) {
    config.headers["x-document-id"] = token;
  }

  return config;
});

export function getQueueStatus() {
  return api.get("/queue-status");
}
export default api;
