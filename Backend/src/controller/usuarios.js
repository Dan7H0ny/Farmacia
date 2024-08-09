const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const verificacion = require('../middlewares/verificacion');

// Crear un usuario
router.post('/crear',verificacion, async (req, res) => {
  const { nombre, apellido, rol, direccion, telefono, correo, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const fechaActual = new Date();
    const correoDuplicado = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo}$`, 'i') } });
    if (correoDuplicado) {return res.status(400).json({ mensaje: 'El correo ya está registrado, ingrese otro correo distinto' });}
    const usuario = new Usuario({ nombre, apellido, rol, direccion, telefono, correo, password: hashedPassword, estado:true, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
});

// Obtener todos los usuarios
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Obtener todos los roles
router.get('/roles',verificacion, async (req, res) => {
  try {
    const usuario = await Usuario.findById(id);
    res.json(usuario.rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario
router.get('/buscar/:id',verificacion, async (req, res) => {
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
router.put('/eliminar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { estado });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado exitosamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

module.exports = router