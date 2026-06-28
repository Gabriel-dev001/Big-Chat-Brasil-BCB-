import React from "react";
import { Header } from "../../components/Header";
import { ClientList } from "../../components/ClientList";
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
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
        <ClientList />{" "}
      </div>
    </div>
  );
};
