import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { getConversations } from "../services/message/api";
import MessageError from "./MessageError";
import { ChatWindow } from "./ChatWindow";

export const ConversationList = ({ refresh = 0, onChatClose }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  const { client } = useAuth();

  const getRecipient = (conversation) => {
    if (conversation.client_id == client.id) {
      return {
        id: conversation.recipient_id,
        name: conversation.recipient_name,
      };
    } else {
      return { id: conversation.client_id, name: conversation.client_name };
    }
  };

  useEffect(() => {
    if (!client?.id) return;

    setLoading(true);

    const fetchConversations = async () => {
      try {
        const { data } = await getConversations(client.id);

        if (data && !data.error) {
          setConversations(data.conversations || []);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error(error);
        setMessageError("Erro ao carregar conversas.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [client, refresh]);

  return (
    <div className="conversation-list-container">
      <style>{`
        .conversation-list-container {
          padding: 24px 0;
          font-family: sans-serif;
        }
        .list-title {
          font-size: 16px;
          color: #a0a0a0;
          margin-bottom: 16px;
          font-weight: 500;
          letter-spacing: .5px;
        }
        .conversation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .conversation-card {
          position: relative;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: .2s;
        }
        .conversation-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,.06);
          border-color: rgba(65,105,225,.35);
          box-shadow: 0 4px 20px rgba(65,105,225,.15);
        }
        .conversation-card.active {
          border-color: rgba(65,105,225,.6);
          background: rgba(65,105,225,.08);
          box-shadow: 0 0 0 2px rgba(65,105,225,.2);
        }
        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .conversation-name {
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .conversation-time {
          color: #888;
          font-size: 12px;
          margin-left: 10px;
          white-space: nowrap;
        }
        .conversation-message {
          color: #cfcfcf;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .conversation-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
        }
        .conversation-id {
          color: #8a8a8a;
          font-size: 12px;
        }
        .conversation-badge {
          min-width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4169e1;
          color: white;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-text {
          color: #a0a0a0;
        }
      `}</style>

      <h2 className="list-title">Conversas</h2>

      {loading ? (
        <p className="loading-text">Carregando conversas...</p>
      ) : (
        <div className="conversation-grid">
          {conversations
            .filter((conversation) => conversation.last_message !== null)
            .map((conversation) => {
              const other = getRecipient(conversation);
              return (
                <div
                  key={conversation.id}
                  className={`conversation-card ${
                    activeConversation?.id == conversation.id ? "active" : ""
                  }`}
                  onClick={() =>
                    setActiveConversation(
                      activeConversation?.id == conversation.id
                        ? null
                        : conversation,
                    )
                  }
                >
                  <div className="conversation-header">
                    <div className="conversation-name" title={other.name}>
                      {other.name}
                    </div>

                    <div className="conversation-time">
                      {conversation.last_message_time
                        ? new Date(
                            conversation.last_message_time,
                          ).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}{" "}
                    </div>
                  </div>

                  <div
                    className="conversation-message"
                    title={conversation.last_message}
                  >
                    {conversation.last_message || "Nenhuma mensagem"}
                  </div>

                  <div className="conversation-footer">
                    {conversation.unread_count > 0 && (
                      <div className="conversation-badge"></div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {messageError && <MessageError message={messageError} />}

      {activeConversation && (
        <ChatWindow
          recipient={getRecipient(activeConversation)}
          onClose={() => {
            setActiveConversation(null);
            onChatClose?.();
          }}
        />
      )}
    </div>
  );
};
