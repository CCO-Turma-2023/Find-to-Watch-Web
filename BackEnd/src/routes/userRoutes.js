const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - sobrenome
 *         - tipo
 *         - email
 *         - senha
 *         - telefone
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado automaticamente para o usuário.
 *         nome:
 *           type: string
 *           description: O nome do usuário.
 *         sobrenome:
 *           type: string
 *           description: O sobrenome do usuário.
 *         tipo:
 *           type: number
 *           description: O tipo do usuário.
 *         email:
 *           type: string
 *           format: email
 *           description: O email do usuário, deve ser único.
 *         senha:
 *           type: string
 *           description: A senha do usuário (não será retornada nas respostas).
 *         telefone:
 *           type: string
 *           description: O telefone do usuário.
 *         created_at:
 *           type: date
 *           description: A data de criação do usuário.
 *         updated_at:
 *           type: date
 *           description: A data de atualização do usuário.
 *       example:
 *           id: "ffe0e7e3-d84c-4c44-8279-c2cdb84df7b9"
 *           nome: "John"
 *           sobrenome: "Doe"
 *           tipo: 0
 *           email: "john.doe@example.com"
 *           telefone: "(35) 91111-1111"
 *           created_at: 2025-07-12 09:47:23
 *           updated_at: 2025-07-12 09:47:23
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API para gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             nome: "John"
 *             sobrenome: "Doe"
 *             email: "john.doe@example.com"
 *             senha: "password123"
 *             telefone: "(35) 91111-1111"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao buscar usuários
 */

router.post('/', userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               senha:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */

router.post('/login', userController.login);

router.use(authMiddleware);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Sem autorização
 *       500:
 *         description: Erro ao buscar usuários
 */

router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Busca o atual usuário
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários
 */

router.get('/me', userController.getMe);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser buscado
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários
 */

router.get('/:id', userController.getUserById);


/**
 * @swagger
 * /users/:
 *   put:
 *     summary: Atualiza o atual usuário (exceto a senha)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             nome: "John"
 *             sobrenome: "Doe"
 *             email: "john.doe@example.com"
 *             telefone: "(35) 91111-1111"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários
 */
router.put('/', userController.updateMe);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário (exceto a senha)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser buscado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             nome: "John"
 *             sobrenome: "Doe"
 *             email: "john.doe@example.com"
 *             telefone: "(35) 91111-1111"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/:
 *   delete:
 *     summary: Remove o atual usuário
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso (sem conteúdo)
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários
 */
router.delete('/', userController.deleteMe);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser buscado
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso (sem conteúdo)
 *       401:
 *         description: Sem autorização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuários.
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;