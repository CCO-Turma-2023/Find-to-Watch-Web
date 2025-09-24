class User {
  constructor({ id, nome, sobrenome, tipo, email, passwordHash, telefone, created_at, updated_at }) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.tipo = tipo; // 0 = normal, 1 = admin
    this.email = email;
    this.passwordHash = passwordHash;
    this.telefone = telefone;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;