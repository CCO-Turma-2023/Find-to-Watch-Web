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
 *   get:
 *     summary: Busca mídias por categoria, gênero e página
 *     tags: [TMDB]
 *     description: |
 *       Retorna uma lista de filmes ou séries com base nos filtros fornecidos.
 *       - Se `genreId` não for fornecido, a rota retornará os itens em alta (trending) do dia.
 *       - Se `genreId` for fornecido, a busca será feita com filtros específicos para garantir a qualidade dos resultados.
 *     parameters:
 *       - in: query
 *         name: mediaType
 *         schema:
 *           type: string
 *           enum: [movie, tv]
 *         required: true
 *         description: O tipo de mídia a ser buscado ('movie' para filmes, 'tv' para séries).
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *         required: false
 *         description: O ID do gênero do TMDb. Se não for fornecido, busca os mais populares (trending).
 *         example: 28
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: O número da página para a paginação dos resultados.
 *     responses:
 *       200:
 *         description: Uma lista de mídias foi retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       400:
 *         description: Parâmetro 'mediaType' ausente ou inválido.
 *       500:
 *         description: Erro interno no servidor ao tentar buscar os dados no TMDb.
 */

router.get("/category", tmdbController.fetchCategory);

module.exports = router;