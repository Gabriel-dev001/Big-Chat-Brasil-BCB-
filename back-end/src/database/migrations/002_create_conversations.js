// const knex = require("../knex");

exports.up = async function (knex) {
  await knex.schema.createTable("conversation", (table) => {
    table.increments("id").primary();

    table.integer("client_id").unsigned().notNullable().references("id").inTable("client").onDelete("CASCADE");

    table.integer("recipient_id").unsigned().notNullable().references("id").inTable("client").onDelete("CASCADE");

    table.string("recipient_name", 255).notNullable();

    table.string("client_name", 255).notNullable();

    table.longtext("last_message").defaultTo(null);

    table.dateTime("last_message_time").defaultTo(null);

    table.integer("unread_count").notNullable().defaultTo(0);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("conversation");
};
