const { Pool } = require('pg');
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT, // precisa da porta 5435 do docker-compose
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

module.exports = pool;
