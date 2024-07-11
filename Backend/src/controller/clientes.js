const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const verificacion = require('../middlewares/verificacion');

router.post('/crear', verificacion, async (req, res) => {
  const { nombreCompleto, correo, telefono, numberIdentity, stringIdentity, usuario_ } = req.body;
  try {
    const fechaActual = new Date();
    const nitDuplicado = await Cliente.findOne({ numberIdentity });
    if (nitDuplicado) {
      return res.status(400).json({ mensaje: 'El Numero de identificacion ya está registrado.' });
    }
    const cliente = new Cliente({ nombreCompleto, correo, telefono, numberIdentity, stringIdentity, usuario_registro: usuario_, usuario_actualizacion: usuario_, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await cliente.save();
    res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
});


// Obtener todos los clientes
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const clientes = await Cliente.find({})
    .populate('usuario_registro', 'nombre apellido')
    .populate('stringIdentity', 'nombre');
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
});

// Obtener un cliente
router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findById(id)
    .populate('usuario_registro', 'nombre apellido rol')
    .populate('usuario_actualizacion', 'nombre apellido rol')
    .populate('stringIdentity', 'nombre');
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el cliente' });
  }
});

// Obtener un cliente
router.get('/buscarci/:nit_ci_cex',verificacion, async (req, res) => {
  const { nit_ci_cex } = req.params;
  try {   
    const cliente = await Cliente.findOne({ nit_ci_cex: nit_ci_cex });
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Usuarioo no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el cliente' });
  }
});

// Actualizar un cliente
router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, correo, telefono, numberIdentity, stringIdentity, usuario_ } = req.body;
  try {
    const fechaActual = new Date();
    const clienteActualizado = await Cliente.findByIdAndUpdate(id, {nombreCompleto, correo, telefono, numberIdentity, stringIdentity, usuario_actualizacion: usuario_, fecha_actualizacion: fechaActual}, { new: true });
    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado exitosamente', clienteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
});


module.exports = router