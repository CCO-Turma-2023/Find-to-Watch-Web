const db = require("../Persistence/config");
const Listas = require("../../Core/Entities/listas");
const { v4: uuidv4 } = require("uuid");
class ListasRepository {
  async createListas(listas) {
    try {
      const { name, user_id, isPublic } = listas;

      const id = uuidv4();
      const query = `
        INSERT INTO listas (id, name, user_id, isPublic) 
        VALUES ($1, $2, $3, $4)
        `;

      const values = [id, name, user_id, isPublic];

      await db.query(query, values);

      return this.getListasById(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getListasPublics() {
    const { rows } = await db.query(
      "SELECT * FROM listas WHERE isPublic = true LIMIT 100"
    );
    return rows.map((row) => new Listas(row));
  }

  async getListasById(id) {
    const { rows } = await db.query("SELECT * FROM listas WHERE id = $1", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  async getListasByUserId(userId) {
    const { rows } = await db.query("SELECT * FROM listas WHERE user_id = $1", [
      userId,
    ]);
    return rows;
  }

  async updateListas(id, listas) {
    const { name, isPublic } = listas;
    const query = `
        UPDATE listas 
        SET name = $2, isPublic = $3 
        WHERE id = $1
        `;
    const values = [id, name, isPublic];
    await db.query(query, values);
    return this.getListasById(id);
  }

  async deleteListas(id) {
    await db.query("DELETE FROM listas WHERE id = $1", [id]);
    return this.getListasById(id);
  }
}

module.exports = new ListasRepository();
