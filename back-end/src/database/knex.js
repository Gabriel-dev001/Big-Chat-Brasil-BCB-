const path = require("path");

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  pool: {
    min: 0,
    max: 5,
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
  },
});

module.exports = knex;
