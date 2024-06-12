const express = require('express');
const router = express.Router();
const Tipo = require('../models/Tipo');
const verificacion = require('../middlewares/verificacion');

router.post('/crear', verificacion, async (req, res) => {
  const { nombreTipo } = req.body;
  try {
    const fechaActual = new Date();
    const tipo = new Tipo({ nombreTipo, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await tipo.save();
    res.status(201).json({ mensaje: 'Tipo creado exitosamente', tipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la tipo' });
  }
});

router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const tipo = await Tipo.find({});
    res.json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las tipo' });
  }
});

router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const tipo = await Tipo.findById(id);
    if (!tipo) {
      return res.status(404).json({ mensaje: 'Tipo no encontrado' });
    }
    res.json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el tipo' });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombreTipo } = req.body;
  try {
    const fechaActual = new Date();
    const tipoActualizado = await Tipo.findByIdAndUpdate(id, {nombreTipo, fecha_actualizacion: fechaActual }, { new: true });
    res.json({ mensaje: 'tipo actualizado exitosamente', tipoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar tipo' });
  }
});

module.exports = router