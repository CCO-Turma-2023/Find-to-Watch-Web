const express = require('express');
const cors = require('cors');

const routes = require('./routes/index');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());

    this.server.use(express.json());
  }

  routes() {
    this.server.use('/api', routes);
  }
}

module.exports = new App().server;