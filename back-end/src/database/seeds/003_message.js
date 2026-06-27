exports.seed = async function (knex) {
  await knex("message").del();

  await knex("message").insert([
    {
      conversation_id: 1,
      sender_id: 1,
      recipient_id: 2,
      content: "Olá Luiz, tudo bem?",
      datetime: new Date(),
      priority: "normal",
    },
    {
      conversation_id: 1,
      sender_id: 2,
      recipient_id: 1,
      content: "Tudo sim! E você?",
      datetime: new Date(),
      priority: "normal",
    },
    {
      conversation_id: 2,
      sender_id: 2,
      recipient_id: 1,
      content: "Por aqui tudo tranquilo!",
      datetime: new Date(),
      priority: "urgent",
    },
  ]);
};
