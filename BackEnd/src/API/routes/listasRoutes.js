const express = require("express");
const router = express.Router();

const listasController = require("../controllers/listasController");
const authMiddleware = require("../middlewares/authMiddleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuthMiddleware");

/**
 * @swagger
 * tags:
 *   name: Listas
 *   description: API para gerenciamento de listas
 */

/**
 * @swagger
 * /listas/createListas:
 *   post:
 *     summary: Cria uma nova lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da lista
 *               description:
 *                 type: string
 *                 description: Descrição da lista
 *               isPublic:
 *                 type: boolean
 *                 description: Indica se a lista é pública
 *             example:
 *               title: Favoritos
 *               description: Filmes e séries que eu gostei
 *               isPublic: false
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 list:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     isPublic:
 *                       type: boolean
 *                     owner:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/getAllUserLists:
 *   get:
 *     summary: Retorna todas as listas de um usuario
 *     tags: [Listas]
 *     responses:
 *       200:
 *         description: Listas públicas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   owner:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/getListasById/{id}:
 *   get:
 *     summary: Retorna uma lista pelo ID
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da lista
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 isPublic:
 *                   type: boolean
 *                 owner:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/updateListas/{id}:
 *   put:
 *     summary: Atualiza uma lista existente
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da lista a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título da lista
 *               description:
 *                 type: string
 *                 description: Nova descrição da lista
 *               isPublic:
 *                 type: boolean
 *                 description: Novo status de privacidade da lista
 *             example:
 *               title: Minha Lista de Compras Atualizada
 *               description: Itens que preciso comprar no supermercado e na farmácia
 *               isPublic: true
 *     responses:
 *       200:
 *         description: Lista atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 list:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     isPublic:
 *                       type: boolean
 *                     owner:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão para atualizar esta lista
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/deleteListas/{id}:
 *   delete:
 *     summary: Deleta uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da lista a ser deletada
 *     responses:
 *       200:
 *         description: Lista deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão para deletar esta lista
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/insertMedia/{id}:
 *   post:
 *     summary: Insere uma mídia em uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da lista onde a mídia será adicionada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media_id:
 *                 type: string
 *                 description: ID da mídia a ser associada à lista
 *             example:
 *               media_id: "a2d4e767-2c4b-434b-a92d-1e671212ba21"
 *     responses:
 *       201:
 *         description: Mídia inserida na lista com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 relation:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /listas/getMediaByListId/{id}:
 *   get:
 *     summary: Retorna todos os conteúdos (mídias) de uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da lista
 *     responses:
 *       200:
 *         description: Conteúdos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro interno
 */

router.get(
  "/getMediaByListId/:id",
  optionalAuthMiddleware,
  listasController.getMediaByListId
);
router.post("/insertMedia/:id", authMiddleware, listasController.insertMedia);
router.post("/createListas", authMiddleware, listasController.createListas);
router.get("/getAllUserLists", authMiddleware, listasController.getAllLists);
router.get(
  "/getListasById/:id",
  optionalAuthMiddleware,
  listasController.getListasById
);
router.put("/updateListas/:id", authMiddleware, listasController.updateListas);
router.delete(
  "/deleteListas/:id",
  authMiddleware,
  listasController.deleteListas
);
router.delete("/removeMedia/:id", authMiddleware, listasController.removeMedia);

module.exports = router;
