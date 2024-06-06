const express = require('express');
const { predecirVentasParaTodosLosProductosARIMA  } = require('../config/arima');

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

module.exports = router;
