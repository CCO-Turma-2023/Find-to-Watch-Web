class User {
  constructor({ id, username, email, passwordhash, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordhash;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;
