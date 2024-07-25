const mongoose = require('mongoose');
const Proveedor = require('../models/Proveedor');
const Complemento = require('../models/Complemento');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Almacen = require('../models/Almacen');

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);

  const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
  return fechaAleatoria;
};
const generarFechaCaducidad = function() {
  const fechaActual = new Date();
  const minMeses = 3;
  const maxMeses = 15;
  
  const mesesAdelante = Math.floor(Math.random() * (maxMeses - minMeses + 1)) + minMeses;
  const fechaCaducidad = new Date(fechaActual);
  fechaCaducidad.setMonth(fechaCaducidad.getMonth() + mesesAdelante);
  
  const diaAleatorio = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
  fechaCaducidad.setDate(diaAleatorio);
  
  return fechaCaducidad;
};


const generarCantidadStock = function() {
  const min = 25;
  const max = 250;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generarPrecioVenta = function(precioCompra) {
  const min = 0.1;
  const max = 10;
  const margen = Math.random() * (max - min) + min;
  const precio = precioCompra + margen;
  return Math.round(precio * 10) / 10;
};

const crearDatos = async function(callback) {
  try {
    const usuarios = await Usuario.find();
    const productos = await Producto.find();
    const categorias = await Complemento.find({ nombreComplemento: 'Categoría' });

    const almacen = [];

    // Convertimos el array de productos en un array de objetos
    const productosDisponibles = productos.map(producto => producto._id);

    for (let i = 0; i < productosDisponibles.length; i++) {
      const producto = productosDisponibles[i];
      const productoObj = productos.find(p => p._id.equals(producto));
      const precioCompra = productoObj.precioCompra;
      const precioVenta = generarPrecioVenta(precioCompra);
      const categoria = categorias[Math.floor(Math.random() * categorias.length)]._id;
      const usuarioRegistro = usuarios[Math.floor(Math.random() * usuarios.length)]._id;
      const usuarioActualizacion = usuarios[Math.floor(Math.random() * usuarios.length)]._id;
      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = new Date(fechaRegistro);
      fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

      almacen.push({
        producto,
        categoria,
        precioVenta,
        cantidad_stock: generarCantidadStock(),
        estado: true,
        fecha_caducidad: generarFechaCaducidad(),
        usuario_registro: usuarioRegistro,
        usuario_actualizacion: usuarioActualizacion,
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion
      });
    }

    await Almacen.insertMany(almacen);
    console.log('Datos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    if (callback) callback();
  }
};

module.exports = crearDatos;
