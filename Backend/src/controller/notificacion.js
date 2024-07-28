const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Notificacion = require('../models/Notificacion');

router.put('/actualizar', verificacion, async (req, res) => {
  const { id, estado } = req.body;

  try {
    // Verificar si el nuevo estado es true y contar notificaciones activas
    if (estado === true) {
      const count = await Notificacion.countDocuments({ estado: true });
      if (count >= 5) {
        return res.status(400).json({ mensaje: 'No se pueden tener más de 5 notificaciones activas' });
      }
    }
    const notificacionActualizada = await Notificacion.findByIdAndUpdate(
      id,
      { 
        estado
      },
      { new: true }
    );
    res.status(200).json({ mensaje: 'Notificacion del estado actualizado exitosamente', notificacionActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la notificación' });
  }
});


router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const productosEncontrados = await Notificacion.find({})
      .populate({
        path: 'producto',
        populate: [
          { path: 'producto', select: 'nombre' },
        ]
      })
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los Productos' });
  }
});

module.exports= router