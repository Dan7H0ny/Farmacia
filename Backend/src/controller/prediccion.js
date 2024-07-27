const express = require('express');
const { predecirVentasParaTodosLosProductosARIMA, predecirVentasParaUnProducto, obtenerVentasDiariasPorCategoria } = require('../config/arima');

const router = express.Router();

router.post('/prediccion-ARIMA', async (req, res) => {
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasParaTodosLosProductosARIMA(diasAPredecir);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
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
