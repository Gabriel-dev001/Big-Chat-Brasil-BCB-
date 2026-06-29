import React, { useState, useEffect } from "react";
import MessageError from "./MessageError";
import { getClients } from "../services/client/api";
import { useAuth } from "../auth/authContext";
import { ChatWindow } from "./ChatWindow";

export const ClientList = ({ onChatClose }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);

  const { client } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await getClients();

        if (data && !data.error) {
          setClients(data.clients);
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="client-list-container">
      <style>{`
        .client-list-container {
          padding: 24px 0;
          font-family: sans-serif;
        }
        .list-title {
          font-size: 16px;
          color: #a0a0a0;
          margin-bottom: 16px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .grid-clients {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .client-card {
          position: relative;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .client-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(65, 105, 225, 0.3);
          box-shadow: 0 4px 20px rgba(65, 105, 225, 0.15);
        }
        .client-card.active {
          border-color: rgba(65, 105, 225, 0.6);
          background: rgba(65, 105, 225, 0.08);
          box-shadow: 0 0 0 2px rgba(65,105,225,0.2), 0 4px 20px rgba(65,105,225,0.2);
        }
        .client-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(65, 105, 225, 0.15);
          border: 2px solid rgba(65, 105, 225, 0.4);
          color: #ffffff;
          font-size: 22px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
        }
        .client-name {
          font-size: 15px;
          font-weight: bold;
          color: #e6e6e6;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        .loading-text {
          color: #a0a0a0;
          font-size: 14px;
        }
      `}</style>

      <h2 className="list-title">Clientes</h2>

      {loading ? (
        <p className="loading-text">Carregando listagem</p>
      ) : (
        <div className="grid-clients">
          {clients
            .filter((item) => item.id !== client?.id)
            .map((item) => (
              <div
                key={item.id}
                className={`client-card ${activeRecipient?.id == item.id ? "active" : ""}`}
                onClick={() =>
                  setActiveRecipient(
                    activeRecipient?.id == item.id ? null : item,
                  )
                }
              >
                <div className="client-avatar">
                  {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                </div>
                <h3 className="client-name" title={item.name}>
                  {item.name}
                </h3>
              </div>
            ))}

          {messageError ? <MessageError message={messageError} /> : ""}
        </div>
      )}

      {activeRecipient && (
        <ChatWindow
          recipient={activeRecipient}
          onClose={() => {
            setActiveRecipient(null);
            onChatClose?.();
          }}
        />
      )}
    </div>
  );
};
