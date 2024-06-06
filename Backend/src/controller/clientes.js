const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const verificacion = require('../middlewares/verificacion');

// Crear un cliente
router.post('/crear',verificacion, async (req, res) => {
  const { nombre, apellido, nit_ci_cex, fecha_registro } = req.body;
  try {
    const nitDuplicado = await Cliente.findOne({ nit_ci_cex });
    if (nitDuplicado) { return res.status(400).json({ mensaje: 'El NIT/CI/CEX ya está registrado.' });}
    const cliente = new Cliente({ nombre, apellido, nit_ci_cex, fecha_registro });
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
      return res.status(404).json({ mensaje: 'Usuarioo no encontrado' });
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
router.put('/actualizar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, nit_ci_cex } = req.body;
  try {
    const cliente = await Cliente.findByIdAndUpdate(id, { nombre, apellido, nit_ci_cex }, { new: true });
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado exitosamente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
});

// Eliminar un cliente
router.delete('/eliminar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  try {
    console.log("nuevo", rol)
    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'No tiene permisos para eliminar clientes' });
    }
    const cliente = await Cliente.findByIdAndDelete(id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado exitosamente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
});

module.exports = router