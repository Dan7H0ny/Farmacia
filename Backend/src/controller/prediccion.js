const express = require('express');
const cron = require('node-cron');
const { predecirVentasParaTodosLosProductosARIMA } = require('../config/arima');
const Prediccion = require('../models/Prediccion');
const Venta = require('../models/Venta');
const verificacion = require('../middlewares/verificacion');

const router = express.Router();

// Ruta para mostrar las predicciones filtradas por día actual
router.post('/mostrar/predicciones', verificacion, async (req, res) => {
  try {
    // Obtener la fecha actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a la medianoche
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); // Establecer la fecha a mañana (para el rango)

    // Buscar las predicciones para hoy
    const prediccionesHoy = await Prediccion.find({
      fecha: {
        $gte: hoy,    // A partir de hoy a las 00:00:00
        $lt: mañana    // Hasta mañana a las 00:00:00
      }
    });

    if (prediccionesHoy.length === 0) {
      return res.status(404).json({ message: 'No se encontraron predicciones para hoy' });
    }

    res.json(prediccionesHoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las predicciones' });
  }
});

router.post('/comparar/predicciones', verificacion, async (req, res) => {
  try {
    const { idProducto, fecha } = req.body; // Obtener la fecha del cuerpo de la solicitud
    if (!fecha) {
      return res.status(400).json({ message: 'La fecha es requerida' });
    }
    // Convertir la fecha a un objeto Date
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1); // Establecer el rango de un solo día

    // Buscar las predicciones en función de la fecha y producto
    const predicciones = await Prediccion.find({
      fecha: {
        $gte: fechaInicio, // Fecha de inicio
        $lt: fechaFin      // Fecha de fin
      },
      productos: idProducto  // Búsqueda por ID del producto
    });

    if (predicciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron predicciones para la fecha dada' });
    }

    // Variable para almacenar los resultados de la comparación
    const resultadosComparacion = {};

    // Agrupar predicciones por producto y fecha
    for (const prediccion of predicciones) {
      const fechaInicioPrediccion = new Date(prediccion.fecha);
      const productoId = prediccion.productos;
      const dia = fechaInicioPrediccion.getDate();
      const mes = fechaInicioPrediccion.getMonth(); // Mes de la predicción
      const anio = fechaInicioPrediccion.getFullYear(); // Año de la predicción

      const key = `${productoId}-${anio}-${mes}-${dia}`; // Clave única por producto y día
      if (!resultadosComparacion[key]) {
        resultadosComparacion[key] = {
          producto: prediccion.nombreProducto,
          comparacion: [],
          totalPredicciones: 0,
          totalCorrectas: 0
        };
      }

      // Obtener las ventas reales para el día
      const ventasReales = await obtenerVentasRealesDesdeFecha(fechaInicioPrediccion, productoId);
      const ventasProducto = ventasReales[productoId];
      if (!ventasProducto) {
        console.log(`No se encontraron ventas para el producto: ${prediccion.nombreProducto}`);
        continue; // Si no hay ventas para el producto, pasar al siguiente
      }

      // Iterar sobre las predicciones de ventas diarias (solo será para un día)
      const prediccionVentas = prediccion.prediccion.ventas; // Array con las predicciones de ventas
      for (let i = 0; i < prediccionVentas.length; i++) {
        const fechaPrediccion = new Date(fechaInicioPrediccion);
        fechaPrediccion.setDate(fechaPrediccion.getDate() + i); // Avanza un día por cada predicción de venta

        // Verificar que la fecha es válida antes de usar toISOString
        if (isNaN(fechaPrediccion.getTime())) {
          console.error(`Fecha inválida en la predicción: ${fechaInicioPrediccion}`);
          continue; // Saltar esta iteración si la fecha no es válida
        }

        // Encontrar la venta real correspondiente a la fecha de la predicción
        const ventaReal = ventasProducto.find(venta => {
          const fechaVentaReal = new Date(venta.fecha); // Usar `venta.fecha` que es string
          const fechasIguales = fechaVentaReal.toISOString().slice(0, 10) === fechaPrediccion.toISOString().slice(0, 10);
          return fechasIguales;
        });

        // Obtener el total de ventas reales
        const real = ventaReal ? ventaReal.totalVentas : 0;

        // Calcular el porcentaje de precisión
        let porcentajePrecisión = 0;
        if (prediccionVentas[i] > 0) { // Asegurarse de que la predicción no sea cero
          const diferencia = Math.abs(prediccionVentas[i] - real);
          porcentajePrecisión = 100 - (diferencia / prediccionVentas[i]) * 100;

          // Asegurarse de que el porcentaje de precisión esté entre 0 y 100
          porcentajePrecisión = Math.max(0, Math.min(100, porcentajePrecisión));
        }

        // Crear el objeto de comparación
        const ventaComparada = {
          dia: i + 1,
          fecha: fechaPrediccion.toISOString().slice(0, 10), // Convertir la fecha a formato YYYY-MM-DD
          prediccion: prediccionVentas[i],
          real: real, // Total de ventas reales
          porcentajePrecisión: porcentajePrecisión // Porcentaje de precisión
        };

        // Añadir a la comparación
        resultadosComparacion[key].comparacion.push(ventaComparada);
        resultadosComparacion[key].totalPredicciones++;
        if (porcentajePrecisión === 100) {
          resultadosComparacion[key].totalCorrectas++;
        }
      }
    }

    for (const key in resultadosComparacion) {
      const item = resultadosComparacion[key];
      
      // Verificamos que haya predicciones para evitar división por cero
      if (item.totalPredicciones > 0) {
        item.precision = Math.max(0, Math.min(100, (item.totalCorrectas / item.totalPredicciones) * 100)); // Porcentaje de aciertos asegurado entre 0 y 100
      } else {
        item.precision = 0; // Si no hay predicciones, la precisión es 0
      }
    }

    // Convertir el objeto a un array para la respuesta
    const responseArray = Object.values(resultadosComparacion);
    
    // Devolver el resultado de las comparaciones
    res.json(responseArray);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al comparar las predicciones con las ventas reales' });
  }
});

// Modificar obtenerVentasRealesDesdeFecha para buscar ventas de un solo día
async function obtenerVentasRealesDesdeFecha(fechaInicio, productoId) {
  try {
    // Calcula la fecha 30 días después de la fecha de inicio
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 30); // Añadir 30 días

    const ventas = await Venta.aggregate([
      { $unwind: '$productos' },
      {
        $match: {
          'productos.producto': productoId, // Coincide con el ID del producto
          'fecha_registro': { 
            $gte: new Date(fechaInicio), // Fecha de inicio
            $lt: new Date(fechaFin) // Fecha de fin (30 días después)
          }
        }
      },
      {
        $group: {
          _id: {
            producto: '$productos.producto',
            fecha: { $dateToString: { format: '%Y-%m-%d', date: '$fecha_registro' } } // Agrupar por fecha (día)
          },
          totalVentas: { $sum: '$productos.cantidad_producto' } // Sumar las ventas del producto
        }
      },
      { $sort: { '_id.fecha': 1 } } // Ordenar por fecha ascendente
    ]);

    const ventasPorProducto = {};
    ventas.forEach(venta => {
      const productoId = venta._id.producto;
      const fechaVenta = venta._id.fecha;

      if (!ventasPorProducto[productoId]) {
        ventasPorProducto[productoId] = [];
      }

      ventasPorProducto[productoId].push({ fecha: fechaVenta, totalVentas: venta.totalVentas });
    });

    return ventasPorProducto;
  } catch (error) {
    console.error('Error al obtener las ventas reales:', error);
    throw error;
  }
}

// Ruta para mostrar predicciones filtradas por nombre del producto
router.post('/mostrar/nombre', verificacion, async (req, res) => {
  try {
    const { nombreProducto } = req.body;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); 
    if (!nombreProducto) {
      return res.status(400).json({ error: 'Nombre del producto es requerido' });
    }

    // Buscar predicciones por nombre del producto usando expresión regular para coincidencias parciales
    const predicciones = await Prediccion.find({ nombreProducto: new RegExp(nombreProducto, 'i'), fecha: {$gte:hoy, $lt:mañana}});

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
router.post('/mostrar/categoria', verificacion, async (req, res) => {
  try {
    const { nombreCategoria } = req.body; // Obtener el nombre de la categoría desde el cuerpo de la solicitud
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    if (!nombreCategoria) {
      return res.status(400).json({ error: 'Nombre de la categoría es requerido' });
    }

    // Buscar predicciones por nombre de categoría
    const predicciones = await Prediccion.find({ nombreCategoria: new RegExp(nombreCategoria, 'i'), fecha: {$gte:hoy, $lt:mañana} });

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

router.post('/mostrar/meses', verificacion, async (req, res) => {
  const { mes } = req.body; // Obtenemos el mes desde el frontend

  try {
    // Filtrar ventas por mes
    const ventasDelMes = await Venta.find({
      fecha_registro: {
        $gte: new Date(new Date().getFullYear(), mes - 1, 1),
        $lt: new Date(new Date().getFullYear(), mes, 1)
      }
    }).populate('productos.producto');

    // Calcular el total de ventas por producto
    const productosVentas = {};

    ventasDelMes.forEach(venta => {
      venta.productos.forEach(prod => {
        if (!productosVentas[prod.nombre]) {
          productosVentas[prod.nombre] = {
            cantidad: 0,
            totalVentas: 0
          };
        }
        productosVentas[prod.nombre].cantidad += prod.cantidad_producto;
        productosVentas[prod.nombre].totalVentas += prod.precio_venta;
      });
    });

    // Ordenar productos por cantidad vendida y tomar los 10 más vendidos
    const topProductos = Object.entries(productosVentas)
      .sort((a, b) => b[1].cantidad - a[1].cantidad)
      .slice(0, 5)
      .map(([nombre, datos]) => ({
        nombre,
        cantidad: datos.cantidad,
        totalVentas: datos.totalVentas / datos.cantidad // Promedio de ventas por producto
      }));

    res.status(200).json(topProductos);
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al obtener las ventas mensuales' });
  }
});

// Función para guardar o actualizar predicciones en la base de datos
async function actualizarPrediccionesEnBD(productosConDiaAgotamiento) {
  for (const productosNuevos of productosConDiaAgotamiento) {
    const { producto, nombreCategoria, nombreProducto, prediccion, diaAgotamiento, datosHistoricos, porcentajeError} = productosNuevos;

    const nuevaPrediccion = new Prediccion({
      productos: producto,  // Guardar el ID del producto
      nombreCategoria,
      nombreProducto,
      prediccion,
      diaAgotamiento,
      datosHistoricos,
      porcentajeError,
      fecha: new Date(),
    });
    await nuevaPrediccion.save();
  }
}

// Cron job para ejecutar la predicción todos los días a la medianoche 2024, 5, 25
cron.schedule('0 0 * * *', async () => {
  try {
    const productosConDiaAgotamiento = await predecirVentasParaTodosLosProductosARIMA(30);
    await actualizarPrediccionesEnBD(productosConDiaAgotamiento);
  } catch (error) {
    console.error('Error al actualizar predicciones:', error);
  }
});

module.exports = router;
