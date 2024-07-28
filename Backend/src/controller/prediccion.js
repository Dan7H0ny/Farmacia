const express = require('express');
const { predecirVentasParaTodosLosProductosARIMA, predecirVentasParaUnProducto, obtenerVentasDiariasPorCategoria } = require('../config/arima');
const Prediccion = require('../models/Prediccion');
const Notificacion = require('../models/Notificacion');

const router = express.Router();

router.post('/prediccion-ARIMA', async (req, res) => {
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasParaTodosLosProductosARIMA(diasAPredecir);

    await Promise.all(productosConDiaAgotamiento.map(async producto => {
      const notificacion = await Notificacion.findOne({
        producto: producto.producto,
        estado: true
      });
      if (notificacion) {
        const prediccionExistente = await Prediccion.findOne({ notificacion: notificacion._id });
        if (!prediccionExistente) {
          // Solo guardar la nueva predicción si no existe una con la misma ID de notificación
          const nuevaPrediccion = new Prediccion({
            notificacion: notificacion._id,
            nombreProducto: producto.nombreProducto,
            prediccion: {
              ventas: producto.prediccion.ventas,
              stockRestante: producto.prediccion.stockRestante
            },
            diaAgotamiento: producto.diaAgotamiento
          });
          await nuevaPrediccion.save();
        }
      }
    }));

    // Enviar solo los productos que tienen una notificación activa y una predicción guardada
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las predicciones de agotamiento' });
  }
});

router.post('/prediccion-para-un-producto', async (req, res) => {
  const { nombre_producto } = req.body;
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasParaUnProducto(diasAPredecir, nombre_producto);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al predecir ventas por el nombre del producto' });
  }
});


router.post('/prediccion-por-categoria', async (req, res) => {
  const { categoria_elegida } = req.body;
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await obtenerVentasDiariasPorCategoria(diasAPredecir, categoria_elegida);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al predecir ventas por categorias' });
  }
});

module.exports = router;
