const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();
const nodemailer = require('nodemailer');
const verificacion = require('../middlewares/verificacion');

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
      res.clearCookie('token');
      return res.status(401).json({ mensaje: 'Usuario inactivo' });
    }
    const { _id, nombre, rol } = usuarioEncontrado;
    const payload = {
      check: true,
      id: _id,
    };
    
    const token = jwt.sign(payload, process.env.TOKEN_LLAVE, {
      expiresIn: process.env.TOKEN_EXPIRACION,
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 900000,
    });

    res.json({ mensaje: 'Ingreso autorizado', _id: _id, nombre: nombre, rol: rol, token: token,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});
  
router.get('/info', verificacion, (req, res) => {
  res.json('INFORMACION TRANSFERIDA');
});

router.post('/restablecer-password', async (req, res) => {
  const { IdUsuario, pin, nuevaContraseña } = req.body;
  try {
    const usuarioExistente = await Usuario.findById(IdUsuario);

    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    if (usuarioExistente.pin !== parseInt(pin)) {
      return res.status(404).json({ mensaje: 'PIN incorrecto' });
    }
    const hashedPassword = await bcryptjs.hash(nuevaContraseña, 10);

    usuarioExistente.password = hashedPassword;

    await usuarioExistente.save();

    res.json({ mensaje: 'Cambio de contraseña exitoso' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
  }
});

router.post('/enviarpin', async (req, res) => {
  const { correo } = req.body;
  try {
    const usuarioEncontrado = await Usuario.findOne({ correo });
    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    const pin = usuarioEncontrado.pin;
    const formaPin = pin.toString().replace(/(\d{3})(?=\d)/g, '$1 ');
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
    //https://antony.ajayuhost.com/restablecer-contraseña/${usuarioEncontrado._id}
    //http://localhost:3000/restablecer-contraseña/${usuarioEncontrado._id}
    // Configuración del correo a enviarx
    const mailOptions = {
      from: `${process.env.GMAIL_ALIAS} <${process.env.GMAIL_USUARIO}>`,
      to: correo,
      subject: 'Cambio de contraseña',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Cambio de contraseña</h2>
        <div style="text-align: center;">
          <img src="cid:logofar" alt="Imagen de Cambio de Contraseña" style="max-width: 100%; height: auto; margin: 10px 0;">
        </div>
        <p>Hola, Hemos recibido una solicitud para restablecer su contraseña. Este es tu código de recuperación de contraseña:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 15px; text-align: center; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
          ${formaPin}
        </div>
        <p>Se recomienda cambiar la contraseña después de ingresar.</p>
        <p>Puede hacer clic en el botón de abajo para ir a la página de restablecimiento de contraseña:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://antony.ajayuhost.com/api/restablecer-contraseña/${usuarioEncontrado._id}" style="text-decoration: none;">
            <button style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer;">Restablecer Contraseña</button>
          </a>
        </div>
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
      res.json({ mensaje: 'Se ha enviado un pin de restablecimiento de contraseña' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
