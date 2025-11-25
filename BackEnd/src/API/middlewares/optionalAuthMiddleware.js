const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Se não tem token, segue como usuário anônimo (req.userId fica undefined)
  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    // Formato ruim, mas como é opcional, podemos ignorar ou logar, 
    // e seguir como anônimo
    return next();
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Se o token expirou ou é inválido, tratamos o usuário como anônimo
    if (err) {
      return next();
    }

    // Se deu certo, salvamos o ID
    req.userId = decoded.id;
    req.tipoUser = decoded.tipo;
    return next();
  });
};