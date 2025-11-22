const express = require("express");
const router = express.Router();

const listasController = require("../controllers/listasController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Listas
 *   description: API para gerenciamento de listas
 */

/**
 * @swagger
 * /api/listas:
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
 * /api/listas:
 *   get:
 *     summary: Retorna todas as listas públicas
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
 * /api/listas/{id}:
 *   get:
 *     summary: Retorna uma lista pública pelo ID
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
 * /api/listas/{id}:
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
 * /api/listas/{id}:
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


router.post("/createListas", authMiddleware, listasController.createListas);
router.get("/getListasPublics", listasController.getListasPublics);
router.get("/getListasById/:id", authMiddleware, listasController.getListasById);
router.get("/getListasByUserId", authMiddleware, listasController.getListasByUserId);
router.put("/updateListas/:id", authMiddleware, listasController.updateListas);
router.delete("/deleteListas/:id", authMiddleware, listasController.deleteListas);

module.exports = router;    