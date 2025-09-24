const db = require('../Persistence/config'); 
const User = require('../../Core/Entities/User'); 
const IUserRepository = require('../../Core/Repositories/IUserRepository'); 


class UserRepository extends IUserRepository {


  async findAll() {
    const [rows] = await db.execute('SELECT id, nome, sobrenome, tipo, email, telefone, created_at, updated_at FROM usuarios');
    return rows.map(row => new User(row));
  }

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return null; 
    }
    return new User(rows[0]);
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT id, nome, sobrenome, tipo, email, telefone, created_at, updated_at FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async create(user) {
    const { id, nome, sobrenome, email, passwordHash, telefone } = user;
    await db.execute(
      'INSERT INTO usuarios (id, nome, sobrenome, tipo, email, passwordHash, telefone) VALUES (?, ?, ?, 0, ?, ?, ?)',
      [id, nome, sobrenome, email, passwordHash, telefone]
    );
    return this.findById(id);
  }

  async update(id, user) {
    const { nome, sobrenome, email, telefone } = user;
    await db.execute(
      'UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome, sobrenome, email, telefone, id]
    );
    return this.findById(id);
  }


  async delete(id) {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  }
}


module.exports = new UserRepository();