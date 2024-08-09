const ARIMA = require('arima');
const Venta = require('../models/Venta');
const Almacen = require('../models/Almacen');

async function obtenerVentasDiarias() {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - 6); // Establece la fecha a seis meses atrás

  try {
    const ventas = await Venta.aggregate([
      {
        $match: {
          fecha_registro: { $gte: fechaLimite } // Solo considera ventas desde hace seis meses
        }
      },
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

      // Añadir la información de ventas a la lista correspondiente al producto
      ventasPorProducto[productoId].push({ fecha: fechaVenta, totalVentas: venta.totalVentas });
    });

    return ventasPorProducto;
  } catch (error) {
    console.error('Error al obtener las ventas diarias:', error);
    throw error;
  }
}

async function predecirVentas(ventasPorProducto, productoId, diasAPredecir) {
  const datosHistoricos = ventasPorProducto[productoId] || [];
  if (datosHistoricos.length === 0) {
    throw new Error(`No hay datos históricos para el producto con ID ${productoId}`);
  }

  const y = datosHistoricos.map(venta => venta.totalVentas);
  const arima = new ARIMA({ p: 1, d: 2, q: 1, verbose: false });
  arima.train(y);
  const predicciones = arima.predict(diasAPredecir);

  const producto = await Almacen.findById(productoId).populate('producto', 'nombre').populate('categoria', 'nombre');
  const capacidadTotalInicial = calcularCapacidadTotalInicial(producto);

  const primeraPrediccion = predicciones[0].map(valor => Math.ceil(valor));

  let capacidadTotal = capacidadTotalInicial;
  let agotado = false;
  let diaAgotamiento;

  // Establece un valor predeterminado para `porcentajeError`
  let porcentajeError = 100;  // Supongamos que 100 significa un error máximo por defecto

  if (datosHistoricos.length > 0 && primeraPrediccion.length > 0) {
    const ultimaVentaReal = datosHistoricos[datosHistoricos.length - 1].totalVentas;
    const ultimaPrediccion = primeraPrediccion[0];  // Usar solo la primera predicción para el cálculo

    if (ultimaVentaReal > 0) { // Asegurarse de que no haya división por cero
      porcentajeError = ((Math.abs(ultimaPrediccion - ultimaVentaReal) / ultimaVentaReal) * 100).toFixed(2);
    }
  }

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
    prediccion: { ventas: primeraPrediccion, stockRestante: Math.max(capacidadTotal, 0) }, 
    diaAgotamiento,
    porcentajeError: parseFloat(porcentajeError), // Añadir el porcentaje de error al resultado
  };
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
      productos.map(producto => predecirVentas(ventasPorProducto, producto._id, diasAPredecir))
    )
  
    const productosConDiaAgotamiento = predicciones.map(prediccion => ({
      ...prediccion,
      diaAgotamiento: prediccion.diaAgotamiento,
    }));
  
    return productosConDiaAgotamiento;
  } catch (error) {
    console.error('Error al predecir ventas para todos los productos:', error);
    throw error;
  }
}

module.exports = { predecirVentasParaTodosLosProductosARIMA};