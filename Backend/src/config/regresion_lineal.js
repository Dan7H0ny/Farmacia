const { SimpleLinearRegression } = require('ml-regression');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

async function obtenerVentasDiarias() {
  try {
    const ventas = await Venta.aggregate([
      { $unwind: '$productos' },
      {
        $group: {
          _id: {
            producto: '$productos.producto',
            fecha: { $dateToString: { format: '%Y-%m-%d', date: '$fecha_emision' } }
          },
          totalVentas: { $sum: '$productos.cantidad' }
        }
      },
      { $sort: { '_id.producto': 1, '_id.fecha': 1 } }
    ]);

    const ventasPorProducto = {};
    ventas.forEach(venta => {
      const productoId = venta._id.producto;
      if (!ventasPorProducto[productoId]) {
        ventasPorProducto[productoId] = [];
      }
      ventasPorProducto[productoId].push({ fecha: venta._id.fecha, totalVentas: venta.totalVentas });
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

  const arima = new ARIMA({ p: 2, d: 1, q: 2, verbose: false });
  arima.train(y);
  const predicciones = arima.predict(diasAPredecir);

  const producto = await Producto.findById(productoId);
  let capacidadTotal;

  switch (producto.categoria) {
    case 'Tabletas':
      capacidadTotal = (producto.capacidad_caja * 250) + producto.capacidad_unitaria;
      break;
    case 'Jarabe':
      capacidadTotal = (producto.capacidad_caja * 1) + producto.capacidad_unitaria;
      break;
    case 'Sueros':
      capacidadTotal = (producto.capacidad_caja * 6) + producto.capacidad_unitaria;
      break;
    case 'Dentifricos':
      capacidadTotal = (producto.capacidad_caja * 9) + producto.capacidad_unitaria;
      break;
    case 'Supositorios':
      capacidadTotal = (producto.capacidad_caja * 12) + producto.capacidad_unitaria;
      break;
    case 'Suplementos':
      capacidadTotal = (producto.capacidad_caja * 5) + producto.capacidad_unitaria;
      break;
    default:
      throw new Error(`Categoría desconocida para el producto con ID ${productoId}`);
  }

  let diaAgotamiento = null;

  const prediccion = predicciones.map((pred, index) => {
    const diaActual = datosHistoricos.length + index + 1;
    capacidadTotal -= pred;
    if (capacidadTotal <= 0 && diaAgotamiento === null) {
      diaAgotamiento = diaActual;
    }
    return { dia: diaActual, ventas: pred, stockRestante: Math.max(capacidadTotal, 0) };
  });

  return { nombreProducto: producto.nombre, prediccion, diaAgotamiento };
}

async function predecirVentasParaTodosLosProductosARIMA(diasAPredecir) {
  try {
    const ventasPorProducto = await obtenerVentasDiarias();
    const productos = await Producto.find({});
    const predicciones = await Promise.all(
      productos.map(producto => predecirVentas(ventasPorProducto, producto._id, diasAPredecir))
    );

    const productosConDiaAgotamiento = predicciones.map(prediccion => ({
      ...prediccion,
      diaAgotamiento: prediccion.prediccion.find(p => p.stockRestante <= 0)?.dia
    }));

    return productosConDiaAgotamiento;
  } catch (error) {
    console.error('Error al predecir ventas para todos los productos:', error);
    throw error;
  }
}

module.exports = { predecirVentasParaTodosLosProductosARIMA };