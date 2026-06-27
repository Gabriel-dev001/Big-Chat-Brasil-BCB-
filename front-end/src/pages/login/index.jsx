import { useState } from "react";
import { authClient, createClient } from "../../services/client/api";
import MessageError from "../../components/MessageError";
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = ({ onLogin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("cpf");
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("prepaid");
  const [messageError, setMessageError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);

      const { data } = await authClient(documentId, documentType);

      if (data.login) {
        if (data.exists) {
          login(data.client, data.token);

          navigate("/dashboard");
        } else {
          setNotFound(true);
        }
      } else {
        setMessageError(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { data } = await createClient({
        name,
        document_id: documentId,
        document_type: documentType,
        plan_type: planType,
      });

      await handleAuth();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Big Chat Brasil</h1>

        {!notFound ? (
          <div className="form">
            <input
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="CPF ou CNPJ"
            />

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
            </select>

            <button onClick={handleAuth} disabled={loading}>
              {loading ? "Aguarde..." : "Entrar"}
            </button>
          </div>
        ) : (
          <div className="form">
            <p className="subtitle">
              Cliente não encontrado. Preencha para cadastrar:
            </p>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
            />

            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="prepaid">Pré-pago</option>
              <option value="postpaid">Pós-pago</option>
            </select>

            <button onClick={handleCreate} disabled={loading}>
              {loading ? "Aguarde..." : "Cadastrar"}
            </button>
          </div>
        )}

        {messageError ? <MessageError message={messageError} /> : ""}
      </div>
    </div>
  );
};

export default Login;
