import React from "react";
import { Header } from "../../components/Header";
import { ClientList } from "../../components/ClientList";
import { useAuth } from "../../auth/authContext";

export const Dashboard = () => {
  const { client } = useAuth();

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">
        <ClientList />{" "}
      </div>
    </div>
  );
};
