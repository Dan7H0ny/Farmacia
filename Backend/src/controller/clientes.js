const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const verificacion = require('../middlewares/verificacion');

// Crear un cliente
router.post('/crear', verificacion, async (req, res) => {
  let { nombre, apellido, correo, telefono, sexo, nit_ci_cex } = req.body;
  correo = correo && correo.trim() !== '' ? correo : 's/n';
  telefono = telefono && telefono.trim() !== '' ? telefono : '00000000';
  try {
    const fechaActual = new Date();
    const nitDuplicado = await Cliente.findOne({ nit_ci_cex });
    if (nitDuplicado) {
      return res.status(400).json({ mensaje: 'El NIT/CI/CEX ya está registrado.' });
    }
    const cliente = new Cliente({ nombre, apellido, correo, telefono, sexo, nit_ci_cex, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await cliente.save();
    res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
});


// Obtener todos los clientes
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const clientes = await Cliente.find({});
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
    const cliente = await Cliente.findById(id);
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
  let { nombre, apellido, correo, telefono, sexo, nit_ci_cex } = req.body;
  try {
    const fechaActual = new Date();
    let updateFields = { nombre, apellido, sexo, nit_ci_cex, fecha_actualizacion: fechaActual };
    if (correo !== 's/n') {updateFields.correo = correo;}
    if (telefono !== '00000000') {updateFields.telefono = telefono;}
    const clienteActualizado = await Cliente.findByIdAndUpdate(id, updateFields, { new: true });
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