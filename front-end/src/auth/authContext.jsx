import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedClient = localStorage.getItem("client_data");
    const savedToken = localStorage.getItem("token");

    if (savedClient && savedToken) {
      setClient(JSON.parse(savedClient));
    }
    setLoading(false);
  }, []);

  const login = (clientData, token) => {
    setClient(clientData);
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("client_data", JSON.stringify(clientData));
  };

  const logout = () => {
    setClient(null);
    localStorage.removeItem("token");
    localStorage.removeItem("client_data");
  };

  // Se ainda estiver carregando o localStorage, não renderiza nada para evitar flash de tela
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ client, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook simples para usar nos componentes
export const useAuth = () => useContext(AuthContext);
