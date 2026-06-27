// const knex = require("../knex");

exports.up = async function (knex) {
  await knex.schema.createTable("message", (table) => {
    table.increments("id").primary();

    table
      .integer("conversation_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("conversation")
      .onDelete("CASCADE");

    table.integer("sender_id").unsigned().notNullable().references("id").inTable("client").onDelete("CASCADE");

    table.integer("recipient_id").unsigned().notNullable().references("id").inTable("client").onDelete("CASCADE");

    table.longText("content").notNullable();

    table.dateTime("datetime").notNullable();

    table.string("priority", 45).notNullable().defaultTo("normal");

    table.string("status", 45).notNullable().defaultTo("queued");

    table.decimal("cost", 10, 2).notNullable().defaultTo(0.25);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("message");
};
