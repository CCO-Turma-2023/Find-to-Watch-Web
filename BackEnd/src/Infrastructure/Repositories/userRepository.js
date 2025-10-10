const db = require("../Persistence/config");
const User = require("../../Core/Entities/User");
const IUserRepository = require("../../Core/Repositories/IUserRepository");

class UserRepository extends IUserRepository {
  async findByEmail(email) {
    const { rows } = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async findById(id) {
    const { rows } = await db.query(
      "SELECT id, username, email, created_at, updated_at FROM usuarios WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async create(user) {
    const { id, email, passwordHash } = user;
    await db.query(
      "INSERT INTO usuarios (id, email, passwordHash) VALUES ($1, $2, $3)",
      [id, email, passwordHash]
    );
    return this.findById(id);
  }

  async update(id, user) {
    const { username, email } = user;
    await db.query(
      "UPDATE usuarios SET username = $1, email = $2 WHERE id = $3",
      [username, email, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }
}

module.exports = new UserRepository();
