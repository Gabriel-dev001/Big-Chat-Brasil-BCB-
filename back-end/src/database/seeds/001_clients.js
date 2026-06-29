exports.seed = async function (knex) {
  await knex("client").del();

  await knex("client").insert([
    {
      name: "Gabriel",
      document_id: "11111111111",
      document_type: "cpf",
      plan_type: "prepaid",
      balance: 10,
      limit: 0,
    },
    {
      name: "Irrah Tech",
      document_id: "22222222222222",
      document_type: "cpf",
      plan_type: "postpaid",
      balance: 0,
      limit: 10,
    },
  ]);
};
