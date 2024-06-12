const express = require('express');
const { predecirVentasParaTodosLosProductosARIMA, predecirVentasParaUnProducto } = require('../config/arima');

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

router.get('/prediccion-ARIMA-nombre/:nombre_producto', async (req, res) => {
  const { nombre_producto } = req.params;
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasParaUnProducto(diasAPredecir, nombre_producto);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las predicciones de agotamiento' });
  }

});

router.get('/prediccion-ARIMA-categoria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasPorCategoriaARIMA(diasAPredecir, id);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las predicciones de agotamiento' });
  }

});

router.get('/prediccion-ARIMA-nombre/:nombre_producto', async (req, res) => {
  const { nombre_producto } = req.params;
  try {
    const diasAPredecir = 7;
    const productosConDiaAgotamiento = await predecirVentasParaUnProducto(diasAPredecir, nombre_producto);
    res.json(productosConDiaAgotamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las predicciones de agotamiento' });
  }

});

module.exports = router;
