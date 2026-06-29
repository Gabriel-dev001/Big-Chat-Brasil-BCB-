import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const tokenRaw = localStorage.getItem("token");
  const token = JSON.parse(tokenRaw);

  if (token) {
    config.headers["x-document-id"] = token;
  }

  return config;
});

// Conversations
export function getConversations(client_id) {
  return api.get(`/conversations/${client_id}`);
}

export function getConversation(id) {
  return api.get(`/conversation/${id}`);
}

export function getConversationByClientRecipient(client_id, recipient_id) {
  return api.get(`/conversation/${client_id}/${recipient_id}`);
}

// Messages
export function getMessages(client_id) {
  return api.get(`/messages/${client_id}`);
}

export function getMessage(id) {
  return api.get(`/message/${id}`);
}

export function getMessagesByConversation(conversation_id) {
  return api.get(`/message/conversation/${conversation_id}`);
}

export function sendMessage(data) {
  return api.post("/message", data);
}

export function markMessagesRead(data) {
  return api.put("/message/mark-read", data);
}

export default api;
