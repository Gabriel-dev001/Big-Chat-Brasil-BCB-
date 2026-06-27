exports.up = async function (knex) {
  await knex.schema.createTable("client", (table) => {
    table.increments("id").primary();

    table.string("name", 255).notNullable();

    table.string("document_id", 45).notNullable().unique();

    table.string("document_type", 45).notNullable().defaultTo("CPF");

    table.string("plan_type", 45).notNullable().defaultTo("prepaid");

    table.decimal("balance", 10, 2).notNullable().defaultTo(0);

    table.decimal("limit", 10, 2).notNullable().defaultTo(0);

    table.boolean("active").notNullable().defaultTo(true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("client");
};
