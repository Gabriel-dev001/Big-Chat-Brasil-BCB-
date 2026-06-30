import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getConversationByClientRecipient,
  getMessagesByConversation,
  sendMessage,
  markMessagesRead,
} from "../services/message/api";
import { useAuth } from "../auth/authContext";

function highlightText(text, term) {
  if (!term.trim()) {
    return text;
  }

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="cw-highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export const ChatWindow = ({ recipient, onClose }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [loadingConv, setLoadingConv] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { client } = useAuth();

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const conversationRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!recipient) return;

    const init = async () => {
      setLoadingConv(true);
      setError(null);
      try {
        const { data } = await getConversationByClientRecipient(
          client.id,
          recipient.id,
        );

        if (data.error || !data.conversation) {
          setError(data.message);
          return;
        }

        const conversation = data.conversation;
        conversationRef.current = conversation;
        setConversation(conversation);

        const { data: msgData } = await getMessagesByConversation(
          conversation.id,
        );

        if (!msgData?.error && msgData?.messages) {
          const visible = msgData.messages.filter(
            (message) =>
              message.status == "delivered" || message.status == "read",
          );

          setMessages(visible);

          const hasUnread = visible.some(
            (message) =>
              message.sender_id == recipient.id &&
              message.status == "delivered",
          );

          if (hasUnread) {
            await markMessagesRead({
              conversation_id: conversation.id,
              sender_id: recipient.id,
            });
          }
        }
      } catch (error) {
        console.error(error);
        setError("Erro ao carregar a conversa.");
      } finally {
        setLoadingConv(false);
      }
    };

    init();

    const interval = setInterval(async () => {
      if (!conversationRef.current) {
        return;
      }

      try {
        const { data: msgData } = await getMessagesByConversation(
          conversationRef.current.id,
        );

        if (!msgData?.error && msgData?.messages) {
          const visible = msgData.messages.filter(
            (message) =>
              message.status == "delivered" || message.status == "read",
          );

          setMessages(visible);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [recipient]);

  useEffect(() => {
    if (!searchTerm) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchTerm]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      setSearchTerm("");
    }
  }, [isSearchOpen]);

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) {
      return messages;
    }

    const lower = searchTerm.toLowerCase();

    return messages.filter((m) => m.content.toLowerCase().includes(lower));
  }, [messages, searchTerm]);

  const matchCount = filteredMessages.length;
  const isFiltering = searchTerm.trim().length > 0;

  const handleSend = async () => {
    try {
      const trimmed = content.trim();

      if (!trimmed || !conversation || sending) {
        return;
      }

      setSending(true);
      setError(null);

      const { data } = await sendMessage({
        conversation_id: conversation.id,
        sender_id: client.id,
        recipient_id: recipient.id,
        content: trimmed,
        priority,
      });

      if (data.error) {
        setError(data.message);
        return;
      }

      setMessages((prev) => [...prev, { ...data.message, _optimistic: true }]);

      setContent("");

      textareaRef.current?.focus();
    } catch (error) {
      console.error(error);
      setError("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const recipientInitial = recipient?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <style>{`
        .cw-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
        }
        .cw-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          width: 440px;
          max-width: calc(100vw - 32px);
          height: 650px;
          max-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          overflow: hidden;
          background: #0d1728;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
              0 0 0 1px rgba(65,105,225,0.15),
              0 24px 60px rgba(0,0,0,0.55),
              0 0 40px rgba(65,105,225,0.08);
          font-family: sans-serif;
          animation: cw-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cw-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .cw-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .cw-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(65,105,225,0.18);
          border: 1.5px solid rgba(65,105,225,0.45);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cw-header-info {
          flex: 1;
          min-width: 0;
        }
        .cw-header-name {
          font-size: 14px;
          font-weight: 700;
          color: #e6e6e6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cw-priority-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 3px;
        }
        .cw-priority-label {
          font-size: 11px;
          color: #94a3b8;
        }
        .cw-toggle {
          position: relative;
          width: 32px;
          height: 17px;
          flex-shrink: 0;
        }
        .cw-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }
        .cw-toggle-track {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .cw-toggle input:checked + .cw-toggle-track {
          background: rgba(255,152,0,0.3);
          border-color: rgba(255,152,0,0.6);
        }
        .cw-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #94a3b8;
          transition: transform 0.2s, background 0.2s;
          pointer-events: none;
        }
        .cw-toggle input:checked ~ .cw-toggle-thumb {
          transform: translateX(15px);
          background: #ff9800;
        }
        .cw-priority-value {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .cw-priority-value.urgent {
          color: #ff9800;
        }
        .cw-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .cw-icon-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          cursor: pointer;
          line-height: 1;
          padding: 5px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cw-icon-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .cw-icon-btn.active {
          color: #4169e1;
          background: rgba(65,105,225,0.15);
        }
        .cw-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .cw-close:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .cw-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          animation: cw-fade-in 0.15s ease;
        }
        @keyframes cw-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cw-search-input {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 10px;
          color: #e2e8f0;
          font-size: 12px;
          font-family: sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .cw-search-input::placeholder { color: #475569; }
        .cw-search-input:focus {
          border-color: rgba(65,105,225,0.5);
        }
        .cw-search-count {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cw-search-count.has-results {
          color: #4169e1;
        }
        .cw-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .cw-body::-webkit-scrollbar { width: 4px; }
        .cw-body::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .cw-state {
          margin: auto;
          text-align: center;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }
        .cw-bubble-row {
          display: flex;
          width: 100%;
        }
        .cw-bubble-row.mine  { justify-content: flex-end; }
        .cw-bubble-row.theirs { justify-content: flex-start; }
        .cw-bubble {
          display: inline-block;
          min-width: 60px;
          max-width: 78%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.45;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          word-break: break-word;   
          width: fit-content;
        }
        .cw-bubble-row.mine .cw-bubble {
          background: rgba(65,105,225,0.28);
          border: 1px solid rgba(65,105,225,0.35);
          color: #e2e8f0;
          border-bottom-right-radius: 4px;
        }
        .cw-bubble-row.theirs .cw-bubble {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: #cbd5e1;
          border-bottom-left-radius: 4px;
        }
        .cw-highlight {
          background: rgba(255, 214, 0, 0.35);
          color: #ffe066;
          border-radius: 2px;
          padding: 0 1px;
          font-style: normal;
        }
        .cw-bubble-row.has-match .cw-bubble {
          outline: 1px solid rgba(255, 214, 0, 0.3);
        }
        .cw-bubble-meta {
          font-size: 10px;
          margin-top: 4px;
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .cw-bubble-row.mine .cw-bubble-meta  { justify-content: flex-end; color: #64748b; }
        .cw-bubble-row.theirs .cw-bubble-meta { justify-content: flex-start; color: #64748b; }
        .cw-badge-urgent {
          font-size: 9px;
          font-weight: 700;
          background: rgba(255,152,0,0.18);
          color: #ff9800;
          border: 1px solid rgba(255,152,0,0.3);
          border-radius: 4px;
          padding: 1px 5px;
          letter-spacing: 0.4px;
        }
        .cw-status-dot {
          font-size: 10px;
        }
        .cw-footer {
          padding: 12px 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }
        .cw-error {
          font-size: 11px;
          color: #ef5350;
          margin-bottom: 8px;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(239,83,80,0.08);
          border: 1px solid rgba(239,83,80,0.2);
        }
        .cw-input-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .cw-textarea {
          flex: 1;
          resize: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-size: 13px;
          font-family: sans-serif;
          line-height: 1.45;
          max-height: 100px;
          outline: none;
          transition: border-color 0.2s;
        }
        .cw-textarea::placeholder { color: #475569; }
        .cw-textarea:focus {
          border-color: rgba(65,105,225,0.45);
        }
        .cw-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: none;
          background: rgba(65,105,225,0.75);
          color: #fff;
          font-size: 17px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }
        .cw-send-btn:hover:not(:disabled) {
          background: rgba(65,105,225,0.95);
          transform: scale(1.05);
        }
        .cw-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="cw-window">
        <div className="cw-header">
          <div className="cw-avatar">{recipientInitial}</div>
          <div className="cw-header-info">
            <div className="cw-header-name" title={recipient?.name}>
              {recipient?.name}
            </div>

            <div className="cw-priority-row">
              <span className="cw-priority-label">Urgente</span>
              <label className="cw-toggle">
                <input
                  type="checkbox"
                  checked={priority == "urgent"}
                  onChange={(e) =>
                    setPriority(e.target.checked ? "urgent" : "normal")
                  }
                />
                <span className="cw-toggle-track" />
                <span className="cw-toggle-thumb" />
              </label>
              <span
                className={`cw-priority-value ${priority == "urgent" ? "urgent" : ""}`}
              >
                {priority == "urgent" ? "Urgente" : "Normal"}
              </span>
            </div>
          </div>

          <div className="cw-header-actions">
            <button
              className={`cw-icon-btn ${isSearchOpen ? "active" : ""}`}
              onClick={() => setIsSearchOpen((v) => !v)}
              title={isSearchOpen ? "Fechar busca" : "Buscar mensagens"}
            >
              Pesquisar
            </button>

            <button className="cw-close" onClick={onClose} title="Fechar">
              ✕
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="cw-search-bar">
            <input
              ref={searchInputRef}
              className="cw-search-input"
              type="text"
              placeholder="Buscar nas mensagens…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {isFiltering && (
              <span
                className={`cw-search-count ${matchCount > 0 ? "has-results" : ""}`}
              >
                {matchCount === 0
                  ? "Nenhum resultado"
                  : `${matchCount} resultado${matchCount > 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        )}

        <div className="cw-body">
          {loadingConv ? (
            <div className="cw-state">Carregando conversa…</div>
          ) : error ? (
            <div className="cw-state">{error}</div>
          ) : filteredMessages.length === 0 ? (
            <div className="cw-state">
              {isFiltering
                ? `Nenhuma mensagem contém "${searchTerm}".`
                : "Nenhuma mensagem ainda."}
            </div>
          ) : (
            filteredMessages.map((msg, i) => {
              const isMine = msg.sender_id == client.id;
              const statusIcon = msg.status == "read" ? "✓✓" : "✓";
              const hasMatch =
                isFiltering &&
                msg.content.toLowerCase().includes(searchTerm.toLowerCase());

              return (
                <div
                  key={msg.id ?? `opt-${i}`}
                  className={`cw-bubble-row ${isMine ? "mine" : "theirs"} ${hasMatch ? "has-match" : ""}`}
                >
                  <div>
                    <div className="cw-bubble">
                      {isFiltering
                        ? highlightText(msg.content, searchTerm)
                        : msg.content}
                    </div>
                    <div className="cw-bubble-meta">
                      {msg.priority == "urgent" && (
                        <span className="cw-badge-urgent">URGENTE</span>
                      )}
                      <span className="cw-status-dot">{statusIcon}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="cw-footer">
          {error && !loadingConv && <div className="cw-error">{error}</div>}

          <div className="cw-input-row">
            <textarea
              ref={textareaRef}
              className="cw-textarea"
              rows={1}
              placeholder="Escreva uma mensagem…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!conversation || loadingConv}
            />
            <button
              className="cw-send-btn"
              onClick={handleSend}
              disabled={!content.trim() || !conversation || sending}
              title="Enviar"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
