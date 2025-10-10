const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

class UserServices {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email e password são obrigatórios.");
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou password inválidos.");
    }

    const isPasswordEqual = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordEqual) {
      throw new Error("Email ou password inválidos.");
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    return { token };
  }

  async createUser({ email, password }) {
    if (!email || !password) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Este email já está em uso.");
    }
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    return this.userRepository.create({ id, email, passwordHash });
  }

  async getMe(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return user;
  }

  async updateMe(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return this.userRepository.update(id, userData);
  }

  async deleteMe(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return this.userRepository.delete(id);
  }
}

module.exports = UserServices;
