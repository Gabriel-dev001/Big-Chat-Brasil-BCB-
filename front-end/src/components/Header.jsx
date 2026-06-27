import React, { useState } from "react";
import { useAuth } from "../auth/authContext";
import { ClientModal } from "./ClientModal";
import { PlanModal } from "./PlanModal";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPlanOpen, setIsModalPlanOpen] = useState(false);
  const { client, logout } = useAuth();

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <header className="bcb-header">
      <style>{`
        .bcb-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 24px;
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #e6e6e6;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .menu-hamburger {
            background: none;
            border: none;
            color: #e6e6e6;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
            transition: color 0.2s ease;
        }
        .menu-hamburger:hover {
            color: #4169e1; /* Cor primária no hover */
        }
        .header-title {
            font-size: 18px;
            margin: 0;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 18px;
        }
        .balance-badge {
            background: rgba(65, 105, 225, 0.15); /* Azul Royal com opacidade */
            border: 1px solid rgba(65, 105, 225, 0.3);
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            font-family: sans-serif;
            box-shadow: 0 0 15px rgba(65, 105, 225, 0.1);        
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
        }
        .balance-badge:hover {
            background: rgba(65, 105, 225, 0.25);
            border-color: rgba(65, 105, 225, 0.5);
            box-shadow: 0 0 20px rgba(65, 105, 225, 0.2);
            transform: translateY(-1px);
        }
        .balance-badge:active {
            transform: translateY(0);
        }
        .btn-logout {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #a0a0a0;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s ease;
        }
        .btn-logout:hover {
            background: #4169e1;
            color: #ffffff;
            border-color: #4169e1;
            box-shadow: 0 0 15px rgba(65, 105, 225, 0.4);
        }
      `}</style>

      <div className="header-left">
        <button
          className="btn-edit-profile"
          onClick={() => setIsModalOpen(true)}
          title="Editar perfil do cliente"
        >
          ⚙️
        </button>
        <h1 className="header-title">{client?.name || "Carregando..."}</h1>
      </div>

      <div className="header-right">
        {/* <button onClick={() => setIsModalPlanOpen(true)} title="Ver Plano">
          <span className="balance-badge">
            {client?.planType === "prepaid" ? "Saldo" : "Limite"}:{" "}
            {formatCurrency(client?.balance ?? client?.limit)}
          </span>
        </button> */}

        <button
          className="balance-badge"
          onClick={() => setIsModalPlanOpen(true)}
          title="Ver Plano"
        >
          {client?.planType === "prepaid" ? "Saldo" : "Limite"}:{" "}
          {formatCurrency(client?.balance ?? client?.limit)}
        </button>

        <button className="btn-logout" onClick={() => navigate("/")}>
          Sair
        </button>
      </div>

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PlanModal
        isOpen={isModalPlanOpen}
        onClose={() => setIsModalPlanOpen(false)}
      />
    </header>
  );
};
