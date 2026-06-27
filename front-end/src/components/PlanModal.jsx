import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { updateClient } from "../services/client/api";
import { useNavigate } from "react-router-dom";

export const PlanModal = ({ isOpen, onClose }) => {
  const { client, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name ? client.name : "");
      setDocumentId(client.document_id ? client.document_id : "");
      setDocumentType(client.document_type ? client.document_type : "");
    }
  }, [client, isOpen]);

  if (!isOpen) {
    return null;
  }

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(11, 18, 32, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-card {
        width: 400px;
        padding: 28px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 40px rgba(65, 105, 225, 0.2);
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top:600px;
      }
      .modal-card h2 {
        font-size: 20px;
        margin: 0;
        color: #e6e6e6;
        text-align: center;
        font-family: sans-serif;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 12px;
      }
      .modal-plan-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .modal-info-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.04);
        font-family: sans-serif;
      }
      .modal-info-group label {
        font-size: 13px;
        color: #a0a0a0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .plan-value {
        font-size: 15px;
        color: #ffffff;
        font-weight: bold;
      }
      .plan-badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
      }
      .plan-badge.prepaid {
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
        border: 1px solid rgba(76, 175, 80, 0.3);
      }
      .plan-badge.postpaid {
        background: rgba(65, 105, 225, 0.15);
        color: #4169e1;
        border: 1px solid rgba(65, 105, 225, 0.3);
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }
      .btn-modal-close {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: transparent;
        color: #e6e6e6;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        transition: 0.2s;
      }
      .btn-modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
      }
    `}</style>

      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Plano do Cliente</h2>

        <div className="modal-plan-list">
          <div className="modal-info-group">
            <label>Tipo de Plano</label>
            <span
              className={`plan-badge ${client?.plan_type === "prepaid" ? "prepaid" : "postpaid"}`}
            >
              {client?.plan_type === "prepaid" ? "Pré-pago" : "Pós-pago"}
            </span>
          </div>

          <div className="modal-info-group">
            <label>Saldo Atual</label>
            <span className="plan-value" style={{ color: "#4caf50" }}>
              {formatCurrency(client?.balance)}
            </span>
          </div>

          <div className="modal-info-group">
            <label>Limite de Crédito</label>
            <span className="plan-value">{formatCurrency(client?.limit)}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
