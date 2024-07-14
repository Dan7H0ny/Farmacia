const express = require('express');
const router = express.Router();
const Complemento = require('../models/Complemento');
const verificacion = require('../middlewares/verificacion');

router.post('/crear', verificacion, async (req, res) => {
  const { nombreComplemento, nombre } = req.body;  
  try {
    const fechaActual = new Date();
    const complementos = new Complemento({ nombreComplemento, nombre, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await complementos.save();
    res.status(201).json({ mensaje: `${nombreComplemento} creado exitosamente`, complementos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: `Error al crear ${nombreComplemento}` });
  }
});

router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const complementos = await Complemento.find({});
    res.json(complementos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los complementos' });
  }
});

router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const complementos = await Complemento.findById(id);
    if (!complementos) {
      return res.status(404).json({ mensaje: 'Complemento no encontrado' });
    }
    res.json(complementos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el complemento' });
  }
});

router.get('/buscarNombre/:nombreComplemento', verificacion, async (req, res) => {
  const { nombreComplemento } = req.params;
  try {
    const complemento = await Complemento.find({ nombreComplemento });
    if (complemento) {
      res.json(complemento);
    } else {
      res.status(404).json({ mensaje: `No se encontró un complemento con el nombre ${nombreComplemento}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: `Error al buscar el complemento con el nombre ${nombreComplemento}` });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombreComplemento, nombre } = req.body;
  try {
    const fechaActual = new Date();
    const complementoActual = await Tipo.findByIdAndUpdate(id, { nombreComplemento, nombre, fecha_actualizacion: fechaActual }, { new: true });
    res.json({ mensaje: `${nombreComplemento} actualizado esitosamente`, complementoActual });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el complemento' });
  }
});

module.exports = router