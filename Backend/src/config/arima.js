const ARIMA = require('arima');
const Venta = require('../models/Venta');
const Almacen = require('../models/Almacen');

async function obtenerVentasDiarias() {
  try {
    const ventas = await Venta.aggregate([
      { $unwind: '$productos' },
      {
        $group: {
          _id: {
            producto: '$productos.producto',
            fecha: { $dateToString: { format: '%Y-%m-%d', date: '$fecha_registro' } }
          },
          totalVentas: { $sum: '$productos.cantidad_producto' }
        }
      },
      { $sort: { '_id.producto': 1, '_id.fecha': 1 } }
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
    console.error('Error al obtener las ventas diarias:', error);
    throw error;
  }
}

function calcularSumaErroresCuadraticos(yReal, yPredicho) {
  let sumaErrores = 0;
  for (let i = 0; i < yReal.length; i++) {
    const error = (yReal[i] || 0) - (yPredicho[i] || 0); // Asigna 0 si yReal[i] o yPredicho[i] son NaN o undefined
    sumaErrores += Math.pow(error, 2);
  }
  return sumaErrores;
}

// Función para calcular AIC
function calcularAIC(sumaErrores, numParametros, n) {
  return n * Math.log(sumaErrores / n) + 2 * numParametros;
}

// Función para seleccionar automáticamente el mejor modelo ARIMA
function seleccionarMejorModeloARIMA(y, maxP = 6, maxD = 1, maxQ = 1) {
  let mejorModelo = null;
  let mejorAIC = Infinity; // El AIC debe ser lo más bajo posible
  let mejorP = 0, mejorD = 0, mejorQ = 0;
  console.log('Iniciando selección del mejor modelo ARIMA...');
  for (let p = 0; p <= maxP; p++) {
    for (let d = 0; d <= maxD; d++) {
      for (let q = 0; q <= maxQ; q++) {console.log(`Entrenando modelo ARIMA(p=${p}, d=${d}, q=${q})...`);
        try {
          // Entrenar el modelo ARIMA con diferentes combinaciones de p, d, q
          const arima = new ARIMA({ p, d, q, verbose: false });
          arima.train(y);

          // Predicción con el modelo entrenado (en este caso, en modo entrenamiento)
          const yPredicho = arima.predict(y.length)[0]; // Usa las mismas entradas para predicción

          // Calcular la suma de errores cuadráticos
          const sumaErrores = calcularSumaErroresCuadraticos(y, yPredicho);

          // Calcular el AIC para esta combinación de p, d, q
          const numParametros = p + d + q;
          const aic = calcularAIC(sumaErrores, numParametros, y.length);

          // Si este modelo tiene un AIC más bajo, lo seleccionamos como el mejor
          if (aic < mejorAIC) {
            mejorAIC = aic;
            mejorModelo = arima;
            mejorP = p;
            mejorD = d;
            mejorQ = q;
          }
        } catch (error) {
          console.log(`Error al entrenar ARIMA(p=${p}, d=${d}, q=${q}):`, error.message);
        }
      }
    }
  }
  console.log('Selección del mejor modelo completada.');
  console.log(`Mejor modelo ARIMA(p=${mejorP}, d=${mejorD}, q=${mejorQ}) con AIC=${mejorAIC}`);
  return mejorModelo;
}

async function predecirVentas(ventasPorProducto, productoId, diasAPredecir) {
  const datosHistoricos = ventasPorProducto[productoId] || [];
  if (datosHistoricos.length === 0) {
    throw new Error(`No hay datos históricos para el producto con ID ${productoId}`);
  }

  const y = datosHistoricos.map(venta => venta.totalVentas);

  // Selección automática del mejor modelo ARIMA
  const mejorModeloArima = seleccionarMejorModeloARIMA(y);

  if (!mejorModeloArima) {
    throw new Error('No se pudo encontrar un modelo ARIMA adecuado.');
  }

  // Predicción con el mejor modelo
  const predicciones = mejorModeloArima.predict(diasAPredecir);

  const producto = await Almacen.findById(productoId).populate('producto', 'nombre').populate('categoria', 'nombre');
  const capacidadTotalInicial = calcularCapacidadTotalInicial(producto);

  // Asegurarse de que las predicciones sean enteros positivos
  const primeraPrediccion = predicciones[0].map(valor => {
    const num = Math.round(valor);
    return isNaN(num) ? 0 : Math.max(num, 0); // Reemplaza NaN por 0
  });
  

  let capacidadTotal = capacidadTotalInicial;
  let agotado = false;
  let diaAgotamiento;

  const erroresAbsolutosMedios = calcularErrorAbsolutoMedio(primeraPrediccion, datosHistoricos);
  const porcentajeError = isNaN(erroresAbsolutosMedios) ? 0 : parseFloat(erroresAbsolutosMedios);

  for (let i = 0; i < primeraPrediccion.length; i++) {
    const ventaDiaActual = primeraPrediccion[i];
    capacidadTotal -= ventaDiaActual;
    if (!agotado && capacidadTotal <= 0) {
      diaAgotamiento = i + 1;
      agotado = true;
      break;
    }
  }

  return {
    producto: producto._id,
    nombreCategoria: producto.categoria.nombre,
    nombreProducto: producto.producto.nombre,
    prediccion: { ventas: primeraPrediccion, stockRestante: producto.cantidad_stock },
    diaAgotamiento,
    datosHistoricos: datosHistoricos.length,
    porcentajeError: porcentajeError,
  };
}


function calcularErrorAbsolutoMedio(predicciones, datosHistoricos) {
  let sumaErrores = 0;
  let count = Math.min(predicciones.length, datosHistoricos.length);

  for (let i = 0; i < count; i++) {
    const error = Math.abs(predicciones[i] - datosHistoricos[i].totalVentas);
    sumaErrores += error;
  }

  // Convertimos el error medio en porcentaje
  return ((sumaErrores / count)).toFixed(2);
}


function calcularCapacidadTotalInicial(producto) {
  // Verifica si el producto está definido
  if (!producto) {
    // Si el producto no está definido, lanza un error
    throw new Error(`Producto no definido`);
  }
  let capacidadTotal = 0;
  if (producto.cantidad_stock <= 0)
    {
      capacidadTotal = producto.cantidad_stock - producto.cantidad_producto;
    }
    else
    {
      capacidadTotal = producto.cantidad_stock;
    }

  return capacidadTotal;
}

async function predecirVentasParaTodosLosProductosARIMA(diasAPredecir) {
  try {
    const ventasPorProducto = await obtenerVentasDiarias();
  
    const productos = await Almacen.find({});
    const predicciones = await Promise.all(
      productos.map(async producto => {
        const productoId = producto._id;
        // Verificar si hay datos históricos antes de llamar a predecirVentas
        if (!ventasPorProducto[productoId] || ventasPorProducto[productoId].length === 0) {
          console.log(`No hay datos históricos para el producto con ID ${productoId}. Ignorando este producto.`);
          return null; // O puedes retornar un objeto vacío o similar si prefieres
        }
        return await predecirVentas(ventasPorProducto, productoId, diasAPredecir);
      })
    );

    // Filtrar las predicciones para eliminar los productos sin datos históricos
    const productosConDiaAgotamiento = predicciones.filter(prediccion => prediccion !== null);

    return productosConDiaAgotamiento;
  } catch (error) {
    console.error('Error al predecir ventas para todos los productos:', error);
    throw error;
  }
}


module.exports = { predecirVentasParaTodosLosProductosARIMA};