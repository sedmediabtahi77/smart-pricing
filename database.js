const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "mahdi1388",
    database: "otaghak"
});

module.exports = pool;