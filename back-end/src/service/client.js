const clientRepository = require("../repository/client");

class ClientService {
  static async auth(document_id, document_type) {
    if (!document_id) {
      return {
        login: false,
        exists: false,
        message: "Informe o documento",
      };
    }

    if (document_type != "cpf" && document_type != "cnpj") {
      return { login: false, exists: false, message: "Tipo documento inválido" };
    }

    document_id = document_id.replace(/\D/g, "");

    if (document_type == "cpf") {
      if (document_id.length != 11) {
        return { login: false, exists: false, message: "CPF inválido" };
      }
    } else {
      if (document_id.length != 14) {
        return { login: false, exists: false, message: "CNPJ inválido" };
      }
    }

    const client = await clientRepository.getByDocument(document_id);

    if (!client) {
      return { login: true, exists: false, message: "Registrar-se" };
    }

    return {
      login: true,
      exists: true,
      token: client.document_id,
      client,
    };
  }

  static async getAll() {
    const clients = await clientRepository.getAll();

    return { error: false, clients };
  }

  static async getById(id) {
    if (!id) {
      return { error: true, message: "Cliente não encontado" };
    }

    const client = await clientRepository.getById(id);

    if (!client) {
      return { error: true, message: "Cliente não encontado" };
    }

    return { error: false, client };
  }

  static async getBalance(id) {
    if (!id) {
      return { error: true, message: "Cliente não encontado" };
    }

    const client_balance = await clientRepository.getBalance(id);

    if (!client_balance) {
      return { error: true, message: "Informações não encontada" };
    }

    return { error: false, client_balance };
  }

  static async create(name, document_id, document_type, plan_type) {
    if (!name) {
      return { error: true, message: "Informe o nome" };
    }

    if (!document_id) {
      return { error: true, message: "Informe o documento" };
    }

    document_id = document_id.replace(/\D/g, "");

    if (!plan_type) {
      return { error: true, message: "Informe o plano" };
    }

    if (plan_type != "prepaid" && plan_type != "postpaid") {
      return { error: true, message: "Tipo plano inválido" };
    }

    if (!document_type) {
      return { error: true, message: "Informe o tipo documento" };
    }

    if (document_type != "cpf" && document_type != "cnpj") {
      return { error: true, message: "Tipo documento inválido" };
    }

    const exist_cliente = await clientRepository.getByDocument(document_id);

    if (exist_cliente) {
      return { error: true, message: "Documento já cadastrado" };
    }

    let balance = 0;
    let limit = 0;

    if (plan_type == "prepaid") {
      balance = 10.0;
    } else {
      limit = 10.0;
    }

    let data = { name, document_id, document_type, plan_type, balance, limit };

    const [client_id] = await clientRepository.create(data);

    if (!client_id) {
      return { error: true, message: "Cliente não encontado" };
    }

    const client = await clientRepository.getById(client_id);

    if (!client) {
      return { error: true, message: "Cliente não encontado" };
    }

    return { error: false, client };
  }

  static async update(id, name, document_id, document_type) {
    if (!id) {
      return { error: true, message: "Cliente não encontado" };
    }

    if (!name) {
      return { error: true, message: "Informe o nome" };
    }

    if (!document_id) {
      return { error: true, message: "Informe o documento" };
    }

    document_id = document_id.replace(/\D/g, "");

    if (!document_type) {
      return { error: true, message: "Informe o tipo documento" };
    }

    if (document_type != "cpf" && document_type != "cnpj") {
      return { error: true, message: "Tipo documento inválido" };
    }

    const exist_cliente = await clientRepository.getByDocument(document_id);

    if (exist_cliente) {
      if (id != exist_cliente.id) {
        return { error: true, message: "Documento já cadastrado" };
      }
    }

    let data = { name, document_id, document_type };

    await clientRepository.update(id, data);

    const client = await clientRepository.getById(id);

    if (!client) {
      return { error: true, message: "Cliente não encontado" };
    }

    return { error: false, client };
  }
}

module.exports = ClientService;
