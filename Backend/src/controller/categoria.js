const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const verificacion = require('../middlewares/verificacion');

router.post('/crear', verificacion, async (req, res) => {
  const { nombre } = req.body;
  try {
    const fechaActual = new Date();
    const categoria = new Categoria({ nombre, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await categoria.save();
    res.status(201).json({ mensaje: 'Categoria creado exitosamente', categoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la Categoria' });
  }
});

router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const categorias = await Categoria.find({});
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las Categoria' });
  }
});

router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoria no encontrado' });
    }
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el categoria' });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const fechaActual = new Date();
    const categoriaAcualizado = await Categoria.findByIdAndUpdate(id, {nombre, fecha_actualizacion: fechaActual }, { new: true });
    res.json({ mensaje: 'categoria actualizado exitosamente', categoriaAcualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar categoria' });
  }
});

module.exports = router