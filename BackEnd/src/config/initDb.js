const mysql = require('mysql2/promise');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

async function initDb() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ADMIN_PASSWORD } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

    await connection.end();

    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)

    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id CHAR(36) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        sobrenome VARCHAR(100) NOT NULL,
        tipo INT NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        passwordHash LONGTEXT NOT NULL,
        telefone VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    const [rows] = await db.query(`SELECT 1 FROM usuarios WHERE email = ? `, ['john.doe@example.com']);

    if (rows.length === 0) {
      await db.query(`
        INSERT INTO usuarios (id, nome, sobrenome, tipo, email, passwordHash, telefone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        'John',
        'Doe',
        1,
        'john.doe@example.com',
        passwordHash,
        '(35) 91111-1111'
      ]);
    }

    await db.end();

  } catch (error) {
    console.error('Erro na inicialização do banco:', error);
    process.exit(1);
  }
}

module.exports = initDb;