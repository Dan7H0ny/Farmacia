const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuarioEncontrado  = await Usuario.findOne({ correo });
    if (!usuarioEncontrado ) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    const match = await bcryptjs.compare(password, usuarioEncontrado.password);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
    if (!usuarioEncontrado.estado ) {
      return res.status(401).json({ mensaje: 'Usuario inactivo' });
    }
    const payload = {
      check: true,
      id: usuarioEncontrado._id,
    };
    
    const token = jwt.sign(payload, process.env.TOKEN_LLAVE, {
      expiresIn: process.env.TOKEN_EXPIRACION,
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 900000,
    });

    res.json({
      mensaje: 'autentificacion correcta',
      _id: usuarioEncontrado._id,
      nombre: usuarioEncontrado.nombre,
      rol: usuarioEncontrado.rol,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


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
          id: decoded.id,
        };
        const newToken = jwt.sign(payload, process.env.TOKEN_LLAVE, {
          expiresIn: process.env.TOKEN_EXPIRACION,
        });

        // Actualizar el token en la respuesta o en el objeto `req`
        res.cookie('token', newToken, {
          httpOnly: true,
          maxAge: 900000,
        });
        //asigna el token para que otros controladores puedan acceder a el
        req.token = newToken;
      } else {
        return res.status(403).send({
          mensaje: 'Token no valido',
        });
      }
    } else {
      // Token válido, se añade la información decodificada al objeto `req`
      req.decoded = decoded;
    }
    next();
  });
});
  
router.get('/info', verificacion, (req, res) => {
  res.json('INFORMACION TRANSFERIDA');
});

router.post('/enviarpin', async (req, res) => {
  const { correo } = req.body;
  try {
    const usuarioEncontrado = await Usuario.findOne({ correo });
    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    // Generar un PIN aleatorio de 5 dígitos
    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    const password = await bcryptjs.hash(pin, 10);
    // Actualizar el PIN en la base de datos para el usuario
    usuarioEncontrado.password = password;
    await usuarioEncontrado.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP del proveedor de correo electrónico
      port: 587, // Puerto del servidor SMTP (generalmente 587 para TLS o 465 para SSL)
      secure: false, // Establecer a true si se utiliza SSL/TLS
      auth: {
        alias: process.env.GMAIL_ALIAS,
        user: process.env.GMAIL_USUARIO, // Usuario del correo electrónico
        pass: process.env.GMAIL_CLAVE, // Contraseña del correo electrónico
      },
    });
    
    // Configuración del correo a enviarx
    const mailOptions = {
      from: `${process.env.GMAIL_ALIAS} <${process.env.GMAIL_USUARIO}>`, // Coloca aquí tus propias credenciales de correo electrónico
      to: correo,
      subject: 'Cambio de contraseña',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Cambio de contraseña</h2>
        <div style="text-align: center;">
          <img src="cid:logofar" alt="Imagen de Cambio de Contraseña" style="max-width: 100%; height: auto; margin: 10px 0;">
        </div>
        <p>Hola, Hemos recibido una solicitud para restablecer su contraseña. Su nueva contraseña temporal es:</p>
        <div style="font-size: 18px; font-weight: bold; text-align: center; background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
          ${pin}
        </div>
        <p>Se recomienda cambiar la contraseña después de ingresar.</p>
        <p>Si usted no solicitó este cambio, por favor contacte a nuestro soporte.</p>
        <p>Gracias,</p>
        <p>El equipo de soporte</p>
        <hr>
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 Farmacia Emiliana. Todos los derechos reservados.</p>
      </div>
      `,
      attachments: [{
        filename: 'LogoFar.png',
        path: './src/img/LogoFar.png',
        cid: 'logofar'
      }]
    };
    

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al enviar la nueva contraseña por correo' });
      }
      res.json({ mensaje: 'La nueva constraseña se ha enviado correctamente' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
