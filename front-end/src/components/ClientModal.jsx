import React, { useState, useEffect } from "react";
import MessageError from "./MessageError";
import { useAuth } from "../auth/authContext";
import { updateClient } from "../services/client/api";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

export const ClientModal = ({ isOpen, onClose }) => {
  const { client, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [messageError, setMessageError] = useState(null);
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

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedData = {
        name,
        document_id: documentId,
        document_type: documentType,
      };

      const { data } = await updateClient(client.id, updatedData);

      if (!data.error) {
        login(data.client, data.client.document_id);

        onClose();

        navigate("/dashboard");
      } else {
        setMessageError(data.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
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
            background: #111827;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 40px rgba(65, 105, 225, 0.2);
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .modal-card h2 {
            font-size: 20px;
            margin: 0;
            color: #e6e6e6;
            text-align: center;
            font-family: sans-serif;
        }
        .modal-info-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-family: sans-serif;
        }
        .modal-info-group label {
            font-size: 12px;
            color: #a0a0a0;
        }
        .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 10px;
        }
        .btn-modal-save {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 6px;
            background: #4169e1;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        }
        .btn-modal-save:hover:not(:disabled) {
            box-shadow: 0 5px 15px rgba(65, 105, 225, 0.4);
        }
        .btn-modal-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .btn-modal-close {
            padding: 10px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            background: transparent;
            color: #e6e6e6;
            cursor: pointer;
            font-weight: bold;
            transition: 0.2s;
        }
        .btn-modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        .modal-info-group input,
        .modal-info-group select {
            padding: 10px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(0, 0, 0, 0.25);
            color: #e6e6e6;
            outline: none;
            width: 100%;
        }
        .modal-info-group select option {
            background-color: #101a33;
            color: #e6e6e6;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <h2>Perfil do Cliente</h2>

          <div className="modal-info-group">
            <label>Nome do Cliente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* <div className="modal-info-group">
          <label>Documento do Cliente</label>
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
          />
        </div>

        <div className="modal-info-group">
          <label>Tipo Documento</label>
          <select
            value={documentType}
            onChange={(e) => setPlanType(e.target.value)}
            className="modal-select"
          >
            <option value="cpf">CPF</option>
            <option value="postpaid">CNPJ</option>
          </select>
        </div> */}

          <div className="modal-actions">
            <button
              className="btn-modal-close"
              onClick={onClose}
              disabled={loading}
            >
              Fechar
            </button>
            <button
              className="btn-modal-save"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {messageError ? <MessageError message={messageError} /> : ""}
        </div>
      </div>
    </>,
    document.body,
  );
};
