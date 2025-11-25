require("dotenv").config();
const request = require("supertest");
const app = require("../src/API/app");
const { pool, initDb } = require("../src/Infrastructure/Persistence/initDb");

// Timeout estendido para chamadas externas (TMDB)
jest.setTimeout(30000);

describe("Cobertura Completa de Rotas (Users, Listas, TMDB)", () => {
  beforeAll(async () => {
    await initDb();
  });

  afterAll(async () => {
    await pool.end();
  });

  let authToken = "";
  let userId = "";
  let listId = "";

  // Dados de Mock
  const mockUser = {
    username: "TestCompleteUser",
    email: `complete_test_${Date.now()}@email.com`,
    password: "password123",
  };

  const mockList = {
    name: "Lista Completa", // Controller usa 'name'
    isPublic: true,
  };

  const mockUpdateList = {
    name: "Lista Atualizada",
    isPublic: false,
  };

  const mockMediaId = "550"; // Clube da Luta (Fight Club)

  describe("Rotas de Usuário", () => {
    // 1. Criação (POST /users)
    it("POST /users - Deve criar usuário (Controller retorna userResponse)", async () => {
      const res = await request(app).post("/api/users").send(mockUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      authToken = res.body.token;
    });

    // 2. Login (POST /users/login)
    it("POST /users/login - Deve autenticar e retornar token", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      authToken = res.body.token;
    });

    // 3. Google Auth (POST /users/google)
    it("POST /users/google - Deve validar ausência de code (Status 400)", async () => {
      const res = await request(app).post("/api/users/google").send({}); // Body vazio

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/código/i);
    });

    // 4. Get Self (/me) (GET /users/me)
    it("GET /users/me - Deve retornar usuário logado", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(mockUser.email);
      userId = res.body.id || res.body._id;
    });

    // 5. Get Public User (GET /users/:id)
    it("GET /users/:id - Deve retornar dados públicos do usuário", async () => {
      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe(mockUser.username);
    });

    // 6. Update User (PUT /users/)
    it("PUT /users/ - Deve atualizar dados do usuário", async () => {
      const res = await request(app)
        .put("/api/users/")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: "User Updated Name" });

      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe("User Updated Name");
    });
  });

  describe("Rotas TMDB", () => {
    // 1. Search (GET /tmdb/search)
    it("GET /tmdb/search - Deve buscar mídia por query", async () => {
      const res = await request(app)
        .get("/api/tmdb/search")
        .query({ query: "Inception" });

      if (res.statusCode !== 500) {
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      }
    });

    // 2. Category (POST /tmdb/category)
    it("POST /tmdb/category - Deve buscar por categoria", async () => {
      const res = await request(app).post("/api/tmdb/category").send({
        mediaType: "movie",
        genreId: 28,
        page: 1,
      });

      if (res.statusCode !== 500) {
        expect(res.statusCode).toBe(200);
      }
    });

    // 3. Details (GET /tmdb/details/:type/:id) -> ESTAVA FALTANDO
    it("GET /tmdb/details/:type/:id - Deve buscar detalhes específicos", async () => {
      const res = await request(app).get(
        `/api/tmdb/details/movie/${mockMediaId}`
      );

      if (res.statusCode !== 500) {
        expect(res.statusCode).toBe(200);
        // O ID retornado pelo TMDB deve ser numérico igual ao solicitado
        expect(res.body.id).toBe(parseInt(mockMediaId));
      }
    });
  });

  describe("Rotas de Listas", () => {
    // 1. Create (POST /listas/createListas)
    it("POST /listas/createListas - Deve criar lista", async () => {
      const res = await request(app)
        .post("/api/listas/createListas")
        .set("Authorization", `Bearer ${authToken}`)
        .send(mockList);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(mockList.name);

      listId = res.body.id || res.body._id;
    });

    // 2. Get All (GET /listas/getAllUserLists)
    it("GET /listas/getAllUserLists - Deve listar listas do usuário", async () => {
      const res = await request(app)
        .get("/api/listas/getAllUserLists")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // 3. Get By ID (GET /listas/getListasById/:id)
    it("GET /listas/getListasById/:id - Deve buscar lista específica", async () => {
      const res = await request(app)
        .get(`/api/listas/getListasById/${listId}`)
        .set("Authorization", `Bearer ${authToken}`); // OptionalAuth

      expect(res.statusCode).toBe(200);
      // Verifica flexibilidade do retorno (name ou title)
      const returnedTitle = res.body.name || res.body.title;
      expect(returnedTitle).toBe(mockList.name);
    });

    // 4. Update (PUT /listas/updateListas/:id)
    it("PUT /listas/updateListas/:id - Deve atualizar lista", async () => {
      const res = await request(app)
        .put(`/api/listas/updateListas/${listId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(mockUpdateList);

      expect(res.statusCode).toBe(200);
      // Verifica se atualizou no retorno
      const returnedTitle = res.body.name || res.body.title;
      expect(returnedTitle).toBe(mockUpdateList.name);
    });

    // 5. Insert Media (POST /listas/insertMedia/:id)
    it("POST /listas/insertMedia/:id - Deve inserir mídia na lista", async () => {
      const res = await request(app)
        .post(`/api/listas/insertMedia/${listId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ media_id: mockMediaId });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBeTruthy();
    });

    // 6. Get Media Content (GET /listas/getMediaByListId/:id) -> ESTAVA FALTANDO
    it("GET /listas/getMediaByListId/:id - Deve retornar itens da lista", async () => {
      const res = await request(app)
        .get(`/api/listas/getMediaByListId/${listId}`)
        .set("Authorization", `Bearer ${authToken}`); // OptionalAuth

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Validação opcional: verificar se a media inserida está lá
      if (res.body.length > 0) {
        // Depende da estrutura do seu banco (se popula o objeto ou traz só o ID)
        const item = res.body[0];
        const itemId = item.media_id || item.id || item;
        expect(itemId.toString()).toContain(mockMediaId);
      }
    });
  });

  describe("Limpeza e Remoção", () => {
    // 1. Delete List (DELETE /listas/deleteListas/:id)
    it("DELETE /listas/deleteListas/:id - Deve remover a lista (204)", async () => {
      const res = await request(app)
        .delete(`/api/listas/deleteListas/${listId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(204);
    });

    // Verificação extra: Lista não deve existir mais
    it("GET /listas/getListasById/:id - Deve retornar 404 após deleção", async () => {
      const res = await request(app)
        .get(`/api/listas/getListasById/${listId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    // 2. Delete User (DELETE /users/)
    it("DELETE /users/ - Deve remover o usuário (204)", async () => {
      const res = await request(app)
        .delete("/api/users/")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
