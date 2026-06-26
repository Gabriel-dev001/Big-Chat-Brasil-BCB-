const clientRepository = require("../repository/client");

class ClientService {
  static async auth(documentId, documentType) {
    try {
      if (!documentId) {
        return {
          login: false,
          exists: false,
          message: "Cliente não encontrado",
        };
      }

      if (documentType != "cpf" && documentType != "cnpj") {
        return { login: false, exists: false, message: "Tipo inválido" };
      }

      documentId = documentId.replace(/\D/g, "");

      if (documentType == "cpf") {
        if (documentId.length != 11) {
          return { login: false, exists: false, message: "CPF inválido" };
        }
      } else {
        if (documentId.length != 14) {
          return { login: false, exists: false, message: "CNPJ inválido" };
        }
      }

      const client = await clientRepository.getByDocument(documentId);

      if (!client) {
        return { login: true, exists: false, message: "Cliente não existe" };
      }

      return {
        login: true,
        exists: true,
        token: client.documentId,
        client,
      };
    } catch (error) {
      console.log(error);

      return {
        login: false,
        exists: false,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async getAll() {
    try {
      const clients = await clientRepository.getAll();

      return { error: false, clients };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async getById(id) {
    try {
      if (!id) {
        return { error: true, message: "Cliente não encontado" };
      }

      const client = await clientRepository.getById(id);

      if (!client) {
        return { error: true, message: "Cliente não encontado" };
      }

      return { error: false, client };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async getBalance(id) {
    try {
      if (!id) {
        return { error: true, message: "Cliente não encontado" };
      }

      const client_balance = await clientRepository.getBalance(id);

      if (!client_balance) {
        return { error: true, message: "Informações não encontada" };
      }

      return { error: false, client_balance };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async create(name, documentId, documentType, planType) {
    try {
      if (!name) {
        return { error: true, message: "Informe o nome" };
      }

      if (!documentId) {
        return { error: true, message: "Informe o documento" };
      }

      documentId = documentId.replace(/\D/g, "");

      if (!planType) {
        return { error: true, message: "Informe o plano" };
      }

      if (planType != "prepaid" && planType != "postpaid") {
        return { error: true, message: "Plano inválido" };
      }

      if (!documentType) {
        return { error: true, message: "Informe o tipo documento" };
      }

      if (documentType != "cpf" && documentType != "cnpj") {
        return { error: true, message: "Tipo documento inválido" };
      }

      const exist_cliente = await clientRepository.getByDocument(documentId);

      if (exist_cliente) {
        return { error: true, message: "Documento já cadastrado" };
      }

      let balance = 0;
      let limit = 0;

      if (planType == "prepaid") {
        balance = 10.0;
      } else {
        limit = 10.0;
      }

      let data = { name, documentId, documentType, planType, balance, limit };

      const [client_id] = await clientRepository.create(data);

      if (!client_id) {
        return { error: true, message: "Cliente não encontado" };
      }

      const client = await clientRepository.getById(client_id);

      if (!client) {
        return { error: true, message: "Cliente não encontado" };
      }

      return { error: false, client };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async update(id, name, documentId, documentType) {
    try {
      if (!id) {
        return { error: true, message: "Cliente não encontado" };
      }

      if (!name) {
        return { error: true, message: "Informe o nome" };
      }

      if (!documentId) {
        return { error: true, message: "Informe o documento" };
      }

      documentId = documentId.replace(/\D/g, "");

      if (!documentType) {
        return { error: true, message: "Informe o tipo documento" };
      }

      if (documentType != "cpf" && documentType != "cnpj") {
        return { error: true, message: "Tipo documento inválido" };
      }

      const exist_cliente = await clientRepository.getByDocument(documentId);

      if (exist_cliente) {
        if (id != exist_cliente.id) {
          return { error: true, message: "Documento já cadastrado" };
        }
      }

      let data = { name, documentId, documentType };

      await clientRepository.update(id, data);

      const client = await clientRepository.getById(id);

      if (!client) {
        return { error: true, message: "Cliente não encontado" };
      }

      return { error: false, client };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }
}

module.exports = ClientService;
