import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { getQueueStatus } from "../../services/queue/api";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const Status = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        const { data } = await getQueueStatus();

        if (data && !data.error) {
          setStatus(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStatus();
  }, []);

  return (
    <>
      <Header />

      <div className="status-page">
        <div className="status-header">
          <h1>Status do Sistema</h1>
          <p>Acompanhe em tempo real a situação da fila de mensagens.</p>
        </div>

        {loading ? (
          <div className="loading-card">Carregando...</div>
        ) : (
          <div>
            <div className="status-grid">
              <div className="status-card">
                <h2>Fila</h2>

                <div className="status-item">
                  <span>Mensagens Normais</span>
                  <strong>{status.normal}</strong>
                </div>

                <div className="status-item">
                  <span>Mensagens Urgentes</span>
                  <strong className="urgent">{status.urgent}</strong>
                </div>

                <div className="status-item total">
                  <span>Total</span>
                  <strong>{status.total}</strong>
                </div>
              </div>

              <div className="status-card">
                <h2>Mensagens</h2>

                <div className="status-item">
                  <span>Na fila</span>
                  <strong>{status.queued}</strong>
                </div>

                <div className="status-item">
                  <span>Processando</span>
                  <strong className="processing">{status.processing}</strong>
                </div>

                <div className="status-item">
                  <span>Entregues</span>
                  <strong className="success">{status.delivered}</strong>
                </div>

                <div className="status-item">
                  <span>Lidas</span>
                  <strong className="info">{status.read}</strong>
                </div>

                <div className="status-item">
                  <span>Falhas</span>
                  <strong className="danger">{status.failed}</strong>
                </div>
              </div>
            </div>

            <div className="status-actions">
              <button
                className="btn-back"
                onClick={() => navigate("/dashboard")}
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
