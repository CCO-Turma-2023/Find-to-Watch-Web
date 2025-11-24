const { Router } = require("express");
const tmdbController = require("../controllers/tmdbController");

const router = Router();

/**
 * @swagger
 * tags:
 * - name: TMDB
 * description: API para buscar dados do The Movie Database (TMDb)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID da mídia no TMDb.
 *         title:
 *           type: string
 *           description: O título do filme (se mediaType for 'movie').
 *         name:
 *           type: string
 *           description: O nome da série (se mediaType for 'tv').
 *         overview:
 *           type: string
 *           description: A sinopse da mídia.
 *         poster_path:
 *           type: string
 *           description: O caminho para o pôster da mídia.
 *         backdrop_path:
 *           type: string
 *           description: O caminho para a imagem de fundo da mídia.
 *         vote_average:
 *           type: number
 *           format: float
 *           description: A nota média da mídia.
 *         release_date:
 *           type: string
 *           format: date
 *           description: A data de lançamento do filme.
 *         first_air_date:
 *           type: string
 *           format: date
 *           description: A data de estreia da série.
 *       example:
 *         id: 299534
 *         title: "Vingadores: Ultimato"
 *         overview: "Após os eventos devastadores..."
 *         poster_path: "/q6725aR8Zs4IwGMXzZT8aC8j4bPF.jpg"
 *         backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
 *         vote_average: 8.3
 *         release_date: "2019-04-24"
 */

/**
 * @swagger
 * /tmdb/category:
 *   post:
 *     summary: Busca mídias por categoria, gênero e página
 *     tags: [TMDB]
 *     description: |
 *       Retorna uma lista de filmes ou séries com base nos filtros enviados no corpo da requisição.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaType:
 *                 type: string
 *                 enum: [movie, tv]
 *               genreId:
 *                 type: integer
 *                 nullable: true
 *               page:
 *                 type: integer
 *                 default: 1
 *             required:
 *               - mediaType
 *             example:
 *               mediaType: "movie"
 *               genreId: 28
 *               page: 1
 *     responses:
 *       200:
 *         description: Lista de mídias retornada com sucesso
 *       400:
 *         description: Parâmetro 'mediaType' ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /tmdb/search:
 *   get:
 *     summary: Busca mídias por nome
 *     tags: [TMDB]
 *     description: |
 *       Retorna uma lista de filmes ou séries com base no termo de pesquisa.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: O termo de pesquisa.
 *     responses:
 *       200:
 *         description: Lista de mídias retornada com sucesso
 *       400:
 *         description: Parâmetro 'query' ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/search", tmdbController.searchMedia);
router.get("/details/:type/:id", tmdbController.getMediaDetails);

router.post("/category", tmdbController.fetchCategory);

module.exports = router;
