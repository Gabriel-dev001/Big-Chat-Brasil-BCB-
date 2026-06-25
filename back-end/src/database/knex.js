const knex = require("knex")({
  client: "mysql2",
  //   connection: {
  //     host: process.env.MYSQL_HOST,
  //     port: process.env.MYSQL_PORT,
  //     user: process.env.MYSQL_USER,
  //     password: process.env.MYSQL_PASSWORD,
  //     database: process.env.MYSQL_DATABASE,
  //   },
  connection: {
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password: "",
    database: "bigchat",
  },
  pool: {
    min: 0,
    max: 2, // deixa baixo pra teste
  },
  debug: true,
});

module.exports = knex;
