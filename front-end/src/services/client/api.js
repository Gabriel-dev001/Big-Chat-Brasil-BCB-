import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  if (config.url == "/auth") {
    return config;
  }

  const tokenRaw = localStorage.getItem("token");
  const token = JSON.parse(tokenRaw);

  if (token) {
    config.headers["x-document-id"] = token;
  }

  return config;
});

export function authClient(document_id, document_type) {
  return api.post("/auth", { document_id, document_type });
}

export function getClients() {
  return api.get("/clients");
}

export function getClient(id) {
  return api.get(`/client/${id}`);
}

export function getBalance(id) {
  return api.get(`/client/balance/${id}`);
}

export function createClient(data) {
  return api.post("/client", data);
}

export function updateClient(id, data) {
  return api.put(`/client/${id}`, data);
}

export default api;
