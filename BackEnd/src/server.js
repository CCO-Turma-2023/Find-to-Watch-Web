const path = require('path')
const app = require('./app');
const initDb = require('./config/initDb');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

require('dotenv').config();

const PORT = process.env.PORT || 3333;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestão Financeira API',
      version: '1.0.0',
      description:
        'Esta é uma API documentada com Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`, 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

async function startServer() {
  await initDb(); 
  app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}/api-docs`);
  });
}

startServer();