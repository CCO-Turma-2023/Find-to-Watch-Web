const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY,
        username VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        passwordHash VARCHAR(255),
        googleId VARCHAR(255) UNIQUE, 
        authProvider VARCHAR(50) NOT NULL DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS listas (
        id UUID PRIMARY KEY,
        name VARCHAR(100),
        user_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isPublic BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES usuarios(id));
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS listMedia (
        media_id VARCHAR(100) NOT NULL,
        list_id UUID NOT NULL, 
        PRIMARY KEY (media_id, list_id),
        FOREIGN KEY (list_id) REFERENCES listas(id));
    `);

    console.log("Banco inicializado com sucesso!");
  } catch (error) {
    console.error("Erro na inicialização do banco:", error);
    process.exit(1);
  }
}

module.exports = { initDb, pool };
