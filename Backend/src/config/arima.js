const ARIMA = require('arima');
const Producto = require('../models/Producto');
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

  const producto = await Almacen.findById(productoId).populate('producto', 'nombre');
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
  return { 
    nombreProducto: producto.producto.nombre, 
    prediccion: { ventas: primeraPrediccion, stockRestante }, 
    diaAgotamiento 
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

async function predecirVentasParaUnProducto(diasAPredecir, nombre_producto) {
  try {
    const ventasPorProducto = await obtenerVentasDiarias();

    // Busca en el campo 'producto' que está referenciado en el modelo 'Almacen'
    const productos = await Almacen.find({})
      .populate({
        path: 'producto',
        match: { nombre: { $regex: new RegExp(nombre_producto, 'i') } },
        select: 'nombre'
      });

    // Filtrar productos que tienen el nombre deseado
    const productosFiltrados = productos.filter(producto => producto.producto);

    if (!productosFiltrados || productosFiltrados.length === 0) {
      throw new Error('Producto no encontrado');
    }

    const predicciones = await Promise.all(
      productosFiltrados.map(producto => predecirVentas(ventasPorProducto, producto._id, diasAPredecir))
    );

    const productosConDiaAgotamiento = predicciones.map(prediccion => ({
      ...prediccion,
      diaAgotamiento: prediccion.diaAgotamiento,
    }));

    return productosConDiaAgotamiento;
  } catch (error) {
    console.error('Error al predecir ventas para el producto:', error);
    throw error;
  }
}

async function obtenerVentasDiariasPorCategoria(diasAPredecir, categoria_elegida) {
  try {
    const ventasPorProducto = await obtenerVentasDiarias();

    // Busca en el campo 'producto' que está referenciado en el modelo 'Almacen'
    const productos = await Almacen.find({})
      .populate({
        path: 'categoria',
        match: { nombre: { $regex: new RegExp(categoria_elegida, 'i') } },
        select: 'nombre'
      });

      const productosFiltrados = productos.filter(producto => producto.categoria && producto.categoria.nombre);
    
      if (!productosFiltrados || productosFiltrados.length === 0) {
        throw new Error('Productos no encontrados en la categoría especificada');
      }
  
      const predicciones = await Promise.all(
        productosFiltrados.map(producto => predecirVentas(ventasPorProducto, producto._id, diasAPredecir))
      );
  
      const productosConDiaAgotamiento = predicciones.map(prediccion => ({
        ...prediccion,
        diaAgotamiento: prediccion.diaAgotamiento,
      }));
  
      return productosConDiaAgotamiento;
    } catch (error) {
      console.error('Error al predecir ventas para la categoría:', error);
      throw error;
    }
  };


module.exports = { predecirVentasParaTodosLosProductosARIMA, predecirVentasParaUnProducto, obtenerVentasDiariasPorCategoria };