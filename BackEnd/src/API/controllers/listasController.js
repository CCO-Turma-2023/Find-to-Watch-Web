const { ListasServices } = require("../../Application/Services/listasServices");
const listasRepository = require("../../Infrastructure/Repositories/listasRepository");

const listasServices = new ListasServices(listasRepository);

class ListasController {
  async createListas(req, res) {
    try {
      const { name, isPublic } = req.body;
      const listas = await listasServices.createListas({
        name,
        isPublic,
        user_id: req.userId,
      });
      return res.status(201).json(listas);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllLists(req, res) {
    try {
      const userId = req.userId;
      const listas = await listasServices.getAllLists(userId);
      return res.status(200).json(listas);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async getListasById(req, res) {
    try {
      const userId = req.userId;
      const listas = await listasServices.getListasById(userId, req.params.id);
      return res.status(200).json(listas);
    } catch (error) {
      const statusCode = error.statusCode || 404;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  async insertMedia(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { media_id } = req.body;

      if (!media_id) {
        return res.status(400).json({ message: "media_id é obrigatório" });
      }

      const result = await listasServices.insertMedia(userId, id, media_id);

      return res.status(201).json({
        message: "Mídia adicionada à lista com sucesso",
        relation: result,
      });
    } catch (error) {
      res.status(400).json({ message: `${error.message}` });
    }
  }

  async getMediaByListId(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const media = await listasServices.getMediaByListId(userId, id);

      return res.status(200).json(media);
    } catch (error) {
      console.error(error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message || "Erro ao buscar conteúdos da lista",
      });
    }
  }

  async updateListas(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;

      const listas = await listasServices.updateListas(userId, id, req.body);
      return res.status(200).json(listas);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async deleteListas(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;

      await listasServices.deleteListas(userId, id);

      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async removeMedia(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params; // ID da lista
      const { media_id } = req.body; // ID da mídia a remover

      if (!media_id) {
        return res.status(400).json({ message: "media_id é obrigatório" });
      }

      await listasServices.removeMedia(userId, id, media_id);

      return res.status(200).json({ message: "Item removido com sucesso" });
    } catch (error) {
      const statusCode = error.message.includes("permissão") ? 403 : 404;
      return res.status(statusCode).json({ message: error.message });
    }
  }
}

module.exports = new ListasController();
