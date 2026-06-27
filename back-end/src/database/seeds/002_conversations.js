exports.seed = async function (knex) {
  await knex("conversation").del();

  await knex("conversation").insert([
    {
      id: 1,
      client_id: 1,
      recipient_id: 2,
      recipient_name: "Luiz",
      last_message: "Bom dia Luiz, tudo bem?",
      last_message_time: new Date(),
      unread_count: 1,
    },
    {
      id: 2,
      client_id: 2,
      recipient_id: 1,
      recipient_name: "Gabriel",
      last_message: "Tudo sim! E você?",
      last_message_time: new Date(),
      unread_count: 0,
    },
  ]);
};
