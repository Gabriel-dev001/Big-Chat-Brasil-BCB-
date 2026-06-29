import React, { useState } from "react";
import { ClientList } from "../../components/ClientList";
import { Header } from "../../components/Header";
import { ConversationList } from "../../components/ConversationList";
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();
  const { client } = useAuth();

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">
        <div className="status-actions">
          <button className="btn-back" onClick={() => navigate("/status")}>
            Status da Fila
          </button>
        </div>
        <ClientList onChatClose={() => setRefresh((v) => v + 1)} />
        <ConversationList
          refresh={refresh}
          onChatClose={() => setRefresh((v) => v + 1)}
        />
      </div>
    </div>
  );
};
