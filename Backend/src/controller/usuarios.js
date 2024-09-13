const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const verificacion = require('../middlewares/verificacion');
const cron = require('node-cron');

// Crear un usuario
router.post('/crear', verificacion, async (req, res) => {
  const { nombre, apellido, rol, direccion, telefono, correo, password } = req.body;

  if (!nombre || !apellido || !rol || !correo || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos: nombre, apellido, rol, correo, o password' });
  }
  try {
    const pin = Math.floor(100000000 + Math.random() * 900000000).toString();
    const hashedPassword = await bcryptjs.hash(password, 10);
    const fechaActual = new Date();
    const correoDuplicado = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo}$`, 'i') } });
    if (correoDuplicado) {return res.status(400).json({ mensaje: 'El correo ya está registrado, ingrese otro correo distinto' });}
    const usuario = new Usuario({ nombre, apellido, rol, direccion, telefono, correo, password:hashedPassword, pin:pin, estado:true, fecha_registro:fechaActual, fecha_actualizacion:fechaActual });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
});

// Obtener todos los usuarios
router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la base de datos' });
  }
});

// Obtener todos los roles
router.get('/roles', async (req, res) => {
  try {
    const usuario = await Usuario.findById(id);
    res.json(usuario.rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario
router.get('/buscar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario
router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, rol, direccion, telefono, correo, password } = req.body;
  const fechaActual = new Date();
  
  try {
    // Buscar al usuario existente por su ID
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si el correo proporcionado es diferente del correo actual
    if (correo.toLowerCase() !== usuarioExistente.correo.toLowerCase()) {
      const correoDuplicado = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo}$`, 'i') } });
      if (correoDuplicado) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado, ingrese otro correo distinto' });
      }
    }

    // Actualizar los datos del usuario
    let usuarioActualizado;
    if (password.trim() === '') {
      usuarioActualizado = await Usuario.findByIdAndUpdate(id, { nombre, apellido, rol, direccion, telefono, correo, fecha_actualizacion: fechaActual }, { new: true });
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      usuarioActualizado = await Usuario.findByIdAndUpdate(id, { nombre, apellido, rol, direccion, telefono, correo, password: hashedPassword, fecha_actualizacion: fechaActual }, { new: true });
    }

    res.json({ mensaje: 'Usuario actualizado exitosamente', usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});
router.put('/actualizarUser/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { direccion, telefono, password } = req.body;
  const fechaActual = new Date();
  
  try {
    let usuarioActualizado;
    if (password.trim() === '') {
      usuarioActualizado = await Usuario.findByIdAndUpdate(id, { direccion, telefono, fecha_actualizacion: fechaActual }, { new: true });
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      usuarioActualizado = await Usuario.findByIdAndUpdate(id, { direccion, telefono, password: hashedPassword, fecha_actualizacion: fechaActual}, { new: true });
    }
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado exitosamente', usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

// Eliminar un usuario
router.put('/eliminar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Buscamos el usuario que se va a modificar
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificamos si el usuario a modificar es el único administrador activo
    const esUnicoAdmin = await Usuario.countDocuments({ rol: 'Administrador', estado: true }) === 1;
    const esUsuarioAdmin = usuario.rol === 'Administrador';

    // Si el usuario a actualizar es el único administrador activo, no actualizamos su estado
    if (esUnicoAdmin && esUsuarioAdmin && estado === false) {
      return res.status(400).json({ mensaje: 'No se puede desactivar al único administrador' });
    }

    // Actualizamos el estado del usuario
    usuario.estado = estado;
    await usuario.save();

    res.json({ mensaje: 'Estado del usuario actualizado', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    const usuarios = await Usuario.find();

    for (const usuario of usuarios) {
      // Generar un PIN aleatorio de 8 dígitos
      const pin = Math.floor(100000000 + Math.random() * 900000000).toString();
      usuario.pin = pin;
      await usuario.save();
    }
  } catch (error) {
    console.error('Error al actualizar los PIN:', error);
  }
});

module.exports = router