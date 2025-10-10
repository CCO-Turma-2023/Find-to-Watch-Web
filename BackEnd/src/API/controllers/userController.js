const UserServices = require("../../Application/Services/userServices");
const userRepository = require("../../Infrastructure/Repositories/userRepository");

const userServices = new UserServices(userRepository);

class UserController {
  async login(req, res) {
    try {
      const result = await userServices.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userServices.createUser(req.body);
      const { passwordHash, ...userResponse } = newUser;
      return res.status(201).json(userResponse);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await userServices.getMe(req.userId);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const updatedUser = await userServices.updateMe(req.userId, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async deleteMe(req, res) {
    try {
      await userServices.deleteMe(req.userId);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
