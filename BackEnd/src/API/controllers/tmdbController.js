const TmdbServices = require("../../Application/Services/tmdbServices");
const tmdbRequests = require("../../Infrastructure/Utils/TmdbRequests/tmdbRequests");

const tmdbServices = new TmdbServices(tmdbRequests);

class TmdbController {
  async fetchCategory(req, res) {
    try {
      const { mediaType, genreId, page } = req.body;

      if (!mediaType) {
        return res
          .status(400)
          .json({ message: "O parâmetro 'mediaType' é obrigatório." });
      }

      const result = await tmdbServices.fetchCategory({
        mediaType,
        genreId,
        page,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      return res.status(500).json({
        message: error.message || "Ocorreu um erro interno no servidor.",
      });
    }
  }

  async searchMedia(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ message: "O parâmetro 'query' é obrigatório." });
      }

      const result = await tmdbServices.searchMedia(query);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar mídia:", error);
      return res.status(500).json({
        message: error.message || "Ocorreu um erro interno no servidor.",
      });
    }
  }
}

module.exports = new TmdbController();
