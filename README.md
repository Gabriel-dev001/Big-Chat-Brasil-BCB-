# Big Chat Brasil (BCB)

Plataforma de troca de mensagens com suporte a planos **pré-pago** e **pós-pago**, fila de prioridade com prevenção de starvation e dashboard em tempo real.

---

## Premissas Assumidas

- Cada cliente é identificado por **CPF ou CNPJ** (usado como token de autenticação via header `x-document-id`)
- Clientes **pré-pagos** começam com saldo de **R$ 10,00** e têm o envio bloqueado ao zerar o saldo
- Clientes **pós-pagos** começam com limite de **R$ 10,00** e têm o envio bloqueado ao atingir o limite
- Custo por mensagem: **R$ 0,25** (normal) e **R$ 0,50** (urgente)
- A fila de mensagens é processada em memória com **prioridade** (urgente > normal) e **prevenção de starvation** — a cada 3 mensagens urgentes processadas, 1 normal é garantida
- O processamento das mensagens é **assíncrono via worker** com simulação de envio (1 segundo por mensagem)
---

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **Knex.js** — query builder e migrations
- **MySQL** — banco de dados relacional

### Frontend
- **React** (Vite)
- **Axios** — consumo da API
- Design dark **glassmorphism** responsivo

### Infraestrutura
- **Docker** + **Docker Compose**

---

## Estrutura do Projeto

```
bcb/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── worker/
│   │   └── database/
│   │       ├── migrations/    # Criação das tabelas
│   │       └── seeds/         # Dados iniciais
│   └── server.js
|
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── login/
│       │   ├── dashboard/
│       │   └── status/
│       ├── components/
│       ├── auth/
│       └── services/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### 1. Clone o repositório

```bash
git clone https://github.com/Gabriel-dev001/Big-Chat-Brasil-BCB-.git
cd Big-Chat-Brasil-BCB-
```

### 2. Suba os containers

```bash
docker-compose up --build
```

> Aguarde os serviços de backend, frontend e banco de dados subirem completamente.

### 3. Acesse a aplicação

| Serviço   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:5173      |
| Backend   | http://localhost:3000      |

---

## Dados para Teste (Seeds)

Dois clientes são criados automaticamente pelos seeds:

| Nome    | CPF           | Plano     | Saldo/Limite |
|---------|---------------|-----------|--------------|
| Gabriel | 111.111.111-11 | Pré-pago  | R$ 10,00     |
| Irrah Tech| 22.222.222/2222-22 | Pós-pago  | Limite R$ 10,00 |
    
---

## 📡 Endpoints da API

### Clientes
| Método | Rota                    | Descrição                     |
|--------|-------------------------|-------------------------------|
| POST   | `/auth`                 | Autenticar por CPF/CNPJ       |
| GET    | `/clients`              | Listar todos os clientes      |
| GET    | `/client/:id`           | Buscar cliente por ID         |
| GET    | `/client/balance/:id`   | Consultar saldo/limite        |
| POST   | `/client`               | Cadastrar cliente             |
| PUT    | `/client/:id`           | Atualizar cliente             |

### Conversas
| Método | Rota                                    | Descrição                        |
|--------|-----------------------------------------|----------------------------------|
| GET    | `/conversations/:client_id`             | Listar conversas do cliente      |
| GET    | `/conversation/:id`                     | Buscar conversa por ID           |
| GET    | `/conversation/:client_id/:recipient_id`| Buscar conversa entre dois clientes |

### Mensagens
| Método | Rota                                   | Descrição                        |
|--------|----------------------------------------|----------------------------------|
| GET    | `/messages/:client_id`                 | Listar mensagens do cliente      |
| GET    | `/message/:id`                         | Buscar mensagem por ID           |
| GET    | `/message/conversation/:conversation_id` | Mensagens de uma conversa      |
| POST   | `/message`                             | Enviar mensagem                  |
| PUT    | `/message/mark-read`                   | Marcar mensagens como lidas      |

### Fila
| Método | Rota            | Descrição                     |
|--------|-----------------|-------------------------------|
| GET    | `/queue-status` | Status da fila em tempo real  |

---

## Diferenciais Implementados

- **Fila com prioridade** (normal/urgente) processada por worker assíncrono
- **Prevenção de starvation** — garante que mensagens normais não fiquem presas indefinidamente
- **Dashboard de status** da fila em tempo real (queued, processing, delivered, read, failed)
- **Autenticação stateless** via header `x-document-id` com token baseado no documento do cliente
- **Arquitetura em 4 camadas** (routes → controllers → services → repositories)
- **Migrations e seeds** versionadas com Knex

## Limitações Conhecidas

- **Tokens de autenticação são armazenados em memória (authStore) - resetam se o servidor reiniciar
- **A fila de mensagens também é em memória — não persiste entre restarts
- **Socket.IO implementado no backend, porém ainda não integrado ao frontend; as atualizações de status das mensagens são refletidas na interface por meio de requisições periódicas (polling).
