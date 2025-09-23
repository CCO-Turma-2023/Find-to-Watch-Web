const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

class UserController {

  async login(req, res){
    const {email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'email e senha são obrigatórios.' });
    }

    const user = await User.findByEmail(email)

    if(!user){
      return res.status(401).json({message: 'email ou senha inválidos'})
    }

    const isEqual = await bcrypt.compare(senha, user.passwordHash)

    if(!isEqual){
      return res.status(401).json({message: 'email ou senha inválidos'})
    }

    const payload = { id: user.id, nome: user.nome + ' ' + user.sobrenome, tipo:user.tipo, email: email };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, 
        { expiresIn: '8h' } 
      );

    return res.status(200).json({token: token})
  }

  async createUser(req, res) {
    try {
      const { nome, sobrenome, email, senha, telefone } = req.body;

      if (!nome || !email || !senha || !telefone || !sobrenome) {
        return res.status(400).json({ message: 'Dados inválidos.' });
      }

      const id = uuidv4();
      const passwordHash = bcrypt.hashSync(senha, 10)
      
      const newUser = await User.create({id, nome, sobrenome, email, passwordHash, telefone });
      
      res.status(201).json(newUser);

    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const tipo = req.tipoUser

      if(!tipo){
        return res.status(401).json({message: 'Necessário ser administrador do sistema'})
      }
      
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }
  
  async getMe(req, res) {
    try {
      const id = req.userId;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const {id} = req.params;
      const tipo = req.tipoUser
      const user = await User.findById(id);

      if(!tipo){
        return res.status(401).json({message: 'Necessário ser administrador do sistema'})
      }
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const id = req.userId
      const { nome, sobrenome, email, telefone } = req.body;
      
      if (!nome || !email || !telefone || !sobrenome) {
        return res.status(400).json({ message: 'Dados inválidos.' });
      }

      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const UpdatedUser = await User.update(id, {nome, sobrenome, email, telefone});

      res.status(200).json(UpdatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params
      const tipo = req.tipoUser
      const { nome, sobrenome, email, telefone } = req.body;

      if(!tipo){
        return res.status(401).json({message: 'Necessário ser administrador do sistema'})
      }
      
      if (!nome || !email || !telefone || !sobrenome) {
        return res.status(400).json({ message: 'Dados inválidos.' });
      }

      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const UpdatedUser = await User.update(id, {nome, sobrenome, email, telefone});

      res.status(200).json(UpdatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  async deleteMe(req, res) {
    try {
      const id = req.userId;

      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await User.delete(id);

      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const {id} = req.params;
      const tipo = req.tipoUser

      if(!tipo){
        return res.status(401).json({message: 'Necessário ser administrador do sistema'})
      }

      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await User.delete(id);

      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

}

module.exports = new UserController();