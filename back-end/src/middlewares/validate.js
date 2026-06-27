const authStore = require("./authStore");

module.exports = (request, response, next) => {
  const documentIdHeader = request.headers["x-document-id"];

  if (!documentIdHeader) {
    return response.status(403).json({
      error: true,
      message: "Token inválido",
    });
  }

  if (!authStore.document_id) {
    return response.status(403).json({
      error: true,
      message: "Token inválido - usuário autenticado",
    });
  }

  if (documentIdHeader != authStore.document_id) {
    return response.status(403).json({
      error: true,
      message: "Token inválido",
    });
  }

  next();
};
