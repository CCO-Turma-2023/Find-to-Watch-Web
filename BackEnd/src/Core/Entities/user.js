class User {
  constructor({ id, username, email, passwordhash, googleid, authprovider, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordhash;
    this.googleId = googleid; 
    this.authProvider = authprovider;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;