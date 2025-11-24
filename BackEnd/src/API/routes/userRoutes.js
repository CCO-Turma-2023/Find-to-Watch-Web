const { Router } = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado automaticamente para o usuário.
 *         username:
 *           type: string
 *           description: O nome do usuário.
 *         email:
 *           type: string
 *           format: email
 *           description: O email do usuário, deve ser único.
 *         password:
 *           type: string
 *           description: A password do usuário (não será retornada nas respostas).
 *         created_at:
 *           type: date
 *           description: A data de criação do usuário.
 *         updated_at:
 *           type: date
 *           description: A data de atualização do usuário.
 *       example:
 *           id: "ffe0e7e3-d84c-4c44-8279-c2cdb84df7b9"
 *           username: "AronPvP"
 *           email: "john.doe@example.com"
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
 *             username: "AronPvP"
 *             email: "john.doe@example.com"
 *             password: "password123"
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

router.post("/", userController.createUser);

/**
 * @swagger
 * /users/google:
 *   post:
 *     summary: Realiza o login ou registro de um usuário com o Google
 *     tags: [Users]
 *     description: |
 *       Autentica um usuário usando um token de acesso do Google.  
 *       Se o usuário não existir no banco de dados, um novo usuário será criado com as informações do perfil do Google.  
 *       Se o usuário já existir, ele será logado e um token JWT será retornado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: O token de acesso (access_token) fornecido pelo Google após o login do usuário.
 *                 example: "ya29.a0AfH6SMD..."
 *     responses:
 *       200:
 *         description: Login ou registro realizado com sucesso, retorna o token JWT da sua aplicação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para ser usado em rotas autenticadas.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: O token do Google não foi fornecido no corpo da requisição.
 *       401:
 *         description: O token do Google é inválido ou expirou.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post("/google", userController.googleLogin);

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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
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

router.post("/login", userController.login);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Busca um usuário pelo id
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

router.get("/", userController.getById);

router.use(authMiddleware);

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

router.get("/me", userController.getById);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Busca um usuário pelo id
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

router.get("/", userController.getById);

/**
 * @swagger
 * /users/:
 *   put:
 *     summary: Atualiza o atual usuário (exceto a password)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: "AronPvP"
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
router.put("/", userController.updateMe);

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
router.delete("/", userController.deleteMe);

module.exports = router;
