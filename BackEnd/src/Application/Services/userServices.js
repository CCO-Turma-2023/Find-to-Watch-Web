const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

class UserServices {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login({ email, senha }) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios.');
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou senha inválidos.');
    }
    const isPasswordEqual = await bcrypt.compare(senha, user.passwordHash);
    if (!isPasswordEqual) {
      throw new Error('Email ou senha inválidos.');
    }
    const payload = { id: user.id, nome: `${user.nome} ${user.sobrenome}`, tipo: user.tipo, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    return { token };
  }

  async createUser({ nome, sobrenome, email, senha, telefone }) {
    if (!nome || !email || !senha || !telefone || !sobrenome) {
      throw new Error('Todos os campos são obrigatórios.');
    }
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('Este email já está em uso.');
    }
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(senha, 10);
    return this.userRepository.create({ id, nome, sobrenome, email, passwordHash, telefone });
  }

  async getAllUsers(requestingUserType) {
    if (requestingUserType !== 1) { 
      throw new Error('Acesso negado. Apenas administradores podem ver todos os usuários.');
    }
    return this.userRepository.findAll();
  }

  async getUserById(id, requestingUserType) {
    if (requestingUserType !== 1) {
        throw new Error('Acesso negado.');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user;
  }
  
  async getMe(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user;
  }

  async updateUser(id, userData, requestingUserType) {
    if (requestingUserType !== 1) {
        throw new Error('Acesso negado.');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return this.userRepository.update(id, userData);
  }

  async updateMe(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id, requestingUserType) {
    if (requestingUserType !== 1) {
        throw new Error('Acesso negado.');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return this.userRepository.delete(id);
  }

  async deleteMe(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return this.userRepository.delete(id);
  }
}

module.exports = UserServices;