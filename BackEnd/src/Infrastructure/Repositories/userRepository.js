const db = require("../Persistence/config");
const User = require("../../Core/Entities/user");
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

  async findByGoogleId(googleId) {
    const { rows } = await db.query(
      "SELECT * FROM usuarios WHERE googleid = $1",
      [googleId]
    );
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async findByUsername(username) {
    const { rows } = await db.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async findById(id) {
    const { rows } = await db.query(
      "SELECT id, username, email, googleId, authProvider, created_at, updated_at FROM usuarios WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return new User(rows[0]);
  }

  async create(user) {
    const { id, username, email, passwordHash, googleId, authProvider } = user;

    const query = `
    INSERT INTO usuarios (id, username, email, passwordHash, googleid, authprovider) 
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      id,
      username,
      email,
      passwordHash || null,
      googleId || null,
      authProvider || "local",
    ];

    await db.query(query, values);

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
