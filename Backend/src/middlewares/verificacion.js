const express = require('express');
const jwt = require('jsonwebtoken');

const verificacion = express.Router();

verificacion.use((req, res, next) => {
  let token = req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;

  if (!token) {
    res.status(401).send({
      error: 'Es necesario un token de autenticación',
    });
    return;
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, process.env.TOKEN_LLAVE, (error, decoded) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        // Token expirado, generar un nuevo token
        const payload = {
          check: true,
          id: decoded,
        };
        const newToken = jwt.sign(payload, process.env.TOKEN_LLAVE, {
          expiresIn: process.env.TOKEN_EXPIRACION,
        });

        // Actualizar el token en la respuesta o en el objeto `req`
        res.cookie('token', newToken, {
          httpOnly: true,
          maxAge: 900000,
        });
        // Asigna el nuevo token al objeto `req` para que otros controladores puedan acceder a él
        req.token = newToken;
      } else {
        return res.json({
          mensaje: 'Token no válido',
        });
      }
    } else {
      // Token válido, se añade la información decodificada al objeto `req`
      req.decoded = decoded;
    }
    next();
  });
});

module.exports = verificacion;
