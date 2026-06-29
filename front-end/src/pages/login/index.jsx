import { useState } from "react";
import { authClient, createClient } from "../../services/client/api";
import MessageError from "../../components/MessageError";
import MessageWarning from "../../components/MessageWarning";
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = ({ onLogin }) => {
  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("cpf");
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("prepaid");
  const [messageError, setMessageError] = useState(null);
  const [messageWarning, setMessageWarning] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
          if (data.message == "Registrar-se") {
            setMessageWarning(data.message);
          } else {
            setMessageError(data.message);
          }
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
    try {
      setLoading(true);

      const cleanDocument = documentId.replace(/\D/g, "");

      const { data } = await createClient({
        name,
        document_id: cleanDocument,
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

  const formatDocument = (value, type) => {
    const numbers = value.replace(/\D/g, "");

    if (type == "cpf") {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return numbers
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
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
              onChange={(e) =>
                setDocumentId(formatDocument(e.target.value, documentType))
              }
              placeholder={documentType == "cpf" ? "CPF" : "CNPJ"}
            />

            <select
              value={documentType}
              onChange={(e) => {
                setDocumentType(e.target.value);
                setDocumentId("");
              }}
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
        {messageWarning ? <MessageWarning message={messageWarning} /> : ""}
      </div>
    </div>
  );
};

export default Login;
