const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

class UserServices {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios.");
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    const isPasswordEqual = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordEqual) {
      throw new Error("Email ou senha inválidos.");
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

  async loginOrRegisterWithGoogle({ code }) {
    try {
      const client = new OAuth2Client(
        process.env.VITE_GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "postmessage"
      );

      const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;

      if (!idToken) {
        throw new Error("Não foi possível obter o ID Token do Google.");
      }

      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.VITE_GOOGLE_CLIENT_ID,
      });

      const googlePayload = ticket.getPayload();

      if (!googlePayload) {
        throw new Error("Payload do Google inválido.");
      }

      const { sub: googleId, email, name: username } = googlePayload;

      let user = await this.userRepository.findByGoogleId(googleId);

      if (!user) {
        const existingUserByEmail = await this.userRepository.findByEmail(email);
        if (existingUserByEmail) {
          throw new Error("Este e-mail já está cadastrado. Faça login com sua senha.");
        }

        const id = uuidv4();
        user = await this.userRepository.create({
          id,
          googleId,
          email,
          username,
          passwordHash: null,
          authProvider: 'google',
        });
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

    } catch (error) {
      console.error("Erro na autenticação com Google:", error);
      throw new Error("Falha ao autenticar com o Google.");
    }
  }

  async createUser({ username, email, password, isGoogle }) {
    if (!username || !email || !password) {
      throw new Error();
    }

    let existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Este email já está em uso.");
    }

    existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error("Este username já está em uso.");
    }
    
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = this.userRepository.create({ id, username, email, passwordHash });

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      authProvider: 'local'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    return { token };
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
