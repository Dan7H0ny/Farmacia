const ARIMA = require('arima');
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
      const fechaVenta = venta._id.fecha;

      if (!ventasPorProducto[productoId]) {
        ventasPorProducto[productoId] = [];
      }

      // Verificar si la fecha ya ha sido agregada para este producto
      const indiceFecha = ventasPorProducto[productoId].findIndex(item => item.fecha === fechaVenta);

      if (indiceFecha !== -1) {
        // Si la fecha ya existe, actualiza el totalVentas para esa fecha
        ventasPorProducto[productoId][indiceFecha].totalVentas += venta.totalVentas;
      } else {
        // Si la fecha no existe, agrega una nueva entrada
        ventasPorProducto[productoId].push({ fecha: fechaVenta, totalVentas: venta.totalVentas });
      }
    });

    return ventasPorProducto;
  } catch (error) {
    console.error('Error al obtener las ventas diarias:', error);
    throw error;
  }
}

async function predecirVentas(ventasPorProducto, productoId, diasAPredecir) {
  let agotado = false; // Inicializar la variable agotado como false
  let diaAgotamiento; // Declarar la variable diaAgotamiento

  const datosHistoricos = ventasPorProducto[productoId] || [];
  if (datosHistoricos.length === 0) {
    throw new Error(`No hay datos históricos para el producto con ID ${productoId}`);
  }

  const y = datosHistoricos.map(venta => venta.totalVentas);

  const arima = new ARIMA({ p: 2, d: 1, q: 2, verbose: false });
  arima.train(y);
  const predicciones = arima.predict(diasAPredecir);

  const producto = await Producto.findById(productoId);
  const capacidadTotalInicial = calcularCapacidadTotalInicial(producto);

  const primeraPrediccion = predicciones[0].map(valor => Math.ceil(valor));

  const diaActual = 1;
  // Asegurarse de que capacidadTotal no sea negativo
  let capacidadTotal = capacidadTotalInicial;

  if (!agotado && capacidadTotal <= 0) {
    diaAgotamiento = diaActual;
    agotado = true; // Marcar el producto como agotado
  }

  // Calcular el stock restante solo si el producto aún no se ha agotado
  const stockRestante = agotado ? 0 : Math.max(capacidadTotal, 0);

  // Sumar las ventas del día actual y actualizar la capacidad total
  for (let i = 0; i < primeraPrediccion.length; i++) {
    const ventaDiaActual = primeraPrediccion[i];
    capacidadTotal -= ventaDiaActual;

    // Verificar si la capacidad total es menor o igual a 0 después de esta iteración
    if (!agotado && capacidadTotal <= 0) {
      diaAgotamiento = diaActual + i;
      agotado = true; // Marcar el producto como agotado
      break; // Salir del bucle si el producto está agotado
    }
  }

  // Devolver solo una predicción por iteración de días
  return { nombreProducto: producto.nombre, prediccion: { ventas: primeraPrediccion, stockRestante }, diaAgotamiento };
}

// Función para calcular la capacidad total inicial en función de la categoría del producto
function calcularCapacidadTotalInicial(producto) {
  switch (producto.categoria) {
    case 'Tabletas':
      return (producto.capacidad_caja * 250) + producto.capacidad_unitaria;
    case 'Jarabe':
      return (producto.capacidad_caja * 1) + producto.capacidad_unitaria;
    case 'Sueros':
      return (producto.capacidad_caja * 6) + producto.capacidad_unitaria;
    case 'Dentifricos':
      return (producto.capacidad_caja * 9) + producto.capacidad_unitaria;
    case 'Supositorios':
      return (producto.capacidad_caja * 12) + producto.capacidad_unitaria;
    case 'Suplementos':
      return (producto.capacidad_caja * 5) + producto.capacidad_unitaria;
    default:
      throw new Error(`Categoría desconocida para el producto con ID ${producto._id}`);
  }
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
      diaAgotamiento: prediccion.diaAgotamiento,
    }));

    return productosConDiaAgotamiento;
  } catch (error) {
    console.error('Error al predecir ventas para todos los productos:', error);
    throw error;
  }
}

module.exports = { predecirVentasParaTodosLosProductosARIMA };