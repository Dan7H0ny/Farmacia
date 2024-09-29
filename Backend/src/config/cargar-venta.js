const mongoose = require('mongoose');
const Cliente = require('../models/Cliente');
const Almacen = require('../models/Almacen');
const Usuario = require('../models/Usuario');
const Venta = require('../models/Venta');

const generarCantidadProducto = function() {
  const min = 1;
  const max = 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const minMesesAtras = 3;
  const maxMesesAtras = 6;

  const mesesAtras = Math.floor(Math.random() * (maxMesesAtras - minMesesAtras + 1)) + minMesesAtras;
  const fechaRegistro = new Date(fechaActual);
  fechaRegistro.setMonth(fechaRegistro.getMonth() - mesesAtras);

  const diaAleatorio = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
  fechaRegistro.setDate(diaAleatorio);

  return fechaRegistro;
};

const cargarVentas = async () => {
  try {
    const clientes = await Cliente.find();
    const productos = await Almacen.find()
      .populate({
        path: 'producto',
        select: 'nombre capacidad_presentacion precioCompra',
        populate: [
          { path: 'tipo', select: 'nombre' },
          { path: 'proveedor', select: 'nombre_marca' }
        ]
      })
      .populate('categoria', 'nombre');
    const usuarios = await Usuario.find();

    const ventas = [];

    for (let i = 0; i < 3000; i++) {
      const cliente = clientes[Math.floor(Math.random() * clientes.length)]._id;
      const usuarioRegistra = usuarios[Math.floor(Math.random() * usuarios.length)]._id;
      const usuarioUpdate = usuarios[Math.floor(Math.random() * usuarios.length)]._id;

      const numProductos = Math.floor(Math.random() * 5) + 1; // Cada venta tiene entre 1 y 5 productos
      const productosVenta = [];
      let precioTotal = 0;

      for (let j = 0; j < numProductos; j++) {
        const producto = productos[Math.floor(Math.random() * productos.length)];
        const cantidadProducto = generarCantidadProducto();
        const precioVenta = producto.precioVenta * cantidadProducto;

        productosVenta.push({
          producto: producto._id,
          nombre: producto.producto.nombre,
          tipo: producto.producto.tipo.nombre, // Asegúrate de que 'tipo' tiene el campo 'nombre'
          proveedor: producto.producto.proveedor.nombre_marca, // Asegúrate de que 'proveedor' tiene el campo 'nombre_marca'
          categoria: producto.categoria.nombre, // Asegúrate de que 'categoria' tiene el campo 'nombre'
          cantidad_producto: cantidadProducto,
          precio_venta: parseFloat(producto.precioVenta)
        });

        precioTotal += parseFloat(precioVenta);
      }

      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = new Date(fechaRegistro);
      fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

      ventas.push({
        cliente,
        productos: productosVenta,
        precio_total: precioTotal.toFixed(1),
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion,
        usuario_registra: usuarioRegistra,
        usuario_update: usuarioUpdate
      });
    }

    await Venta.insertMany(ventas);
    console.log('Datos de ventas insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos de ventas:', error);
  }
};

module.exports = cargarVentas;
