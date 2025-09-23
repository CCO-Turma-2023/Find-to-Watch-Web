const db = require('../config/db');

class UserModel {

  async findAll() {
    const [rows] = await db.execute('SELECT id, nome, sobrenome, tipo, email, telefone, created_at, updated_at FROM usuarios');
    return rows;
  }

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT id, nome, sobrenome, tipo, passwordHash, email FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT id, nome, sobrenome, tipo, email, telefone, created_at, updated_at FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  async create(user) {
    const { id, nome, sobrenome, email, passwordHash, telefone } = user;

    await db.execute(
        'INSERT INTO usuarios (id, nome, sobrenome, tipo, email, passwordHash, telefone) VALUES (?, ?, ?, 0, ?, ?, ?)',
        [id, nome, sobrenome, email, passwordHash, telefone]
    );

    const CreatedUser = await this.findById(id);

    return CreatedUser;
  }

  async update(id, user) {
    const { nome, sobrenome, email, telefone } = user;

    await db.execute(
        'UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, telefone = ? WHERE id = ?',
        [nome, sobrenome, email, telefone, id]
    );

    const UpdatedUser = await this.findById(id);

    return UpdatedUser;
  }

  async delete(id) {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

    return;
    }
}

module.exports = new UserModel();