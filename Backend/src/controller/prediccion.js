const express = require('express');
const cron = require('node-cron');
const { predecirVentasParaTodosLosProductosARIMA } = require('../config/arima');
const Prediccion = require('../models/Prediccion');

const router = express.Router();

// Ruta para mostrar las primeras predicciones filtradas por diaAgotamiento
router.post('/mostrar/predicciones', async (req, res) => {
  try {
    const productosConDiaAgotamiento = await predecirVentasParaTodosLosProductosARIMA(7);
    await actualizarPrediccionesEnBD(productosConDiaAgotamiento);
    // Buscar todas las predicciones
    const predicciones = await Prediccion.find({});

    if (predicciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron predicciones' });
    }

    // Filtrar las predicciones por diaAgotamiento en el rango de 1 a 7
    const prediccionesFiltradas = predicciones
      .filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7)
      .sort((a, b) => a.diaAgotamiento - b.diaAgotamiento) // Ordenar por diaAgotamiento de menor a mayor
      .slice(0, 5); 

    res.json(prediccionesFiltradas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las predicciones' });
  }
});


// Ruta para mostrar predicciones filtradas por nombre del producto
router.post('/mostrar/nombre', async (req, res) => {
  try {
    const { nombreProducto } = req.body; // Obtener el nombre del producto desde el cuerpo de la solicitud
    if (!nombreProducto) {
      return res.status(400).json({ error: 'Nombre del producto es requerido' });
    }

    // Buscar predicciones por nombre del producto usando expresión regular para coincidencias parciales
    const predicciones = await Prediccion.find({ nombreProducto: new RegExp(nombreProducto, 'i')});

    if (predicciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron predicciones para el nombre proporcionado' });
    }

    // Filtrar las predicciones por diaAgotamiento en el rango de 1 a 7
    const prediccionesFiltradas = predicciones
      .filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7)
      .sort((a, b) => a.diaAgotamiento - b.diaAgotamiento) // Ordenar por diaAgotamiento de menor a mayor
      .slice(0, 5);

    res.json(prediccionesFiltradas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las predicciones por nombre' });
  }
});

// Ruta para mostrar predicciones filtradas por categoría
router.post('/mostrar/categoria', async (req, res) => {
  try {
    const { nombreCategoria } = req.body; // Obtener el nombre de la categoría desde el cuerpo de la solicitud
    if (!nombreCategoria) {
      return res.status(400).json({ error: 'Nombre de la categoría es requerido' });
    }

    // Buscar predicciones por nombre de categoría
    const predicciones = await Prediccion.find({ nombreCategoria: new RegExp(nombreCategoria, 'i') });

    if (predicciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron predicciones para la categoría proporcionada' });
    }

    // Filtrar las predicciones por diaAgotamiento en el rango de 1 a 7
    const prediccionesFiltradas = predicciones
      .filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7)
      .sort((a, b) => a.diaAgotamiento - b.diaAgotamiento) // Ordenar por diaAgotamiento de menor a mayor
      .slice(0, 5); // Tomar los primeros 5 resultados

    res.json(prediccionesFiltradas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las predicciones por categoría' });
  }
});


// Función para guardar o actualizar predicciones en la base de datos
async function actualizarPrediccionesEnBD(productosConDiaAgotamiento) {
  for (let productos of productosConDiaAgotamiento) {
    const { producto, nombreCategoria, nombreProducto, prediccion, diaAgotamiento } = productos;

    // Buscar la predicción existente en la base de datos por el ID del producto
    let prediccionExistente = await Prediccion.findOne({ productos: producto });

    if (prediccionExistente) {
      // Si existe, actualizar la predicción
      prediccionExistente.nombreCategoria = nombreCategoria;
      prediccionExistente.nombreProducto = nombreProducto;
      prediccionExistente.prediccion = prediccion;
      prediccionExistente.diaAgotamiento = diaAgotamiento;
      await prediccionExistente.save();
    } else {
      // Si no existe, crear una nueva predicción
      const nuevaPrediccion = new Prediccion({
        productos: producto,  // Guardar el ID del producto
        nombreCategoria,
        nombreProducto,
        prediccion,
        diaAgotamiento
      });
      await nuevaPrediccion.save();
    }
  }
}


// Cron job para ejecutar la predicción todos los días a la medianoche
cron.schedule('0 8,20 * * *', async () => {
  try {
    const productosConDiaAgotamiento = await predecirVentasParaTodosLosProductosARIMA(7);
    await actualizarPrediccionesEnBD(productosConDiaAgotamiento);
  } catch (error) {
    console.error('Error al actualizar predicciones:', error);
  }
});

module.exports = router;
