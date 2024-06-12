const mongoose = require('mongoose');
const Producto = require('../models/Producto');  // Ajusta la ruta según tu estructura de archivos
const Venta = require('../models/Venta');  // Ajusta la ruta según tu estructura de archivos
const Usuario = require('../models/Usuario');  // Ajusta la ruta según tu estructura de archivos
const Cliente = require('../models/Cliente');  // Ajusta la ruta según tu estructura de archivos

const generarNombre = function() {
  const nombres = [
    'Ibuprofeno', 'Paracetamol', 'Amoxicilina', 'Aspirina', 'Cetirizina', 'Omeprazol', 'Loratadina',
    'Ranitidina', 'Metformina', 'Enalapril', 'Simvastatina', 'Levotiroxina', 'Losartan', 'Diazepam',
    'Insulina', 'Azitromicina', 'Glibenclamida', 'Furosemida', 'Clonazepam', 'Ketorolaco', 'Prednisona',
    'Salbutamol', 'Alprazolam', 'Hidroxicloroquina', 'Montelukast'
  ];
  return nombres[Math.floor(Math.random() * nombres.length)];
};

const generarCantidad = function() {
  return Math.floor(Math.random() * 100) + 1;
};

const generarPrecio = function() {
  return Math.floor(Math.random() * (100 - 5 + 1)) + 5;
};

const generarUsuario = async function() {
  const usuarios = await Usuario.find();
  return usuarios[Math.floor(Math.random() * usuarios.length)]._id;
};

const generarCliente = async function() {
  const clientes = await Cliente.find();
  return clientes[Math.floor(Math.random() * clientes.length)]._id;
};

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);

  const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
  return fechaAleatoria;
};

const primerCliente = async function(callback) {
  try {
    // Obtener todos los productos de la base de datos
    const productosExistentes = await Producto.find();
    
    for (let i = 0; i < 500; i++) {
      const productos = [];

      for (let j = 0; j < 5; j++) {
        // Seleccionar un producto aleatorio de los existentes
        const producto = productosExistentes[Math.floor(Math.random() * productosExistentes.length)];

        productos.push({
          producto: producto._id,
          cantidad_producto: generarCantidad(),
          precio_producto: producto.precio
        });
      }

      const precio_total = productos.reduce((total, prod) => total + (prod.cantidad_producto * prod.precio_producto), 0);
      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = generarFechaAleatoria();

      await Venta.create({
        cliente: await generarCliente(),
        productos: productos,
        precio_total: precio_total,
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion,
        usuario_registra: await generarUsuario(),
        usuario_update: await generarUsuario()
      });

      console.log(`Venta ${i + 1} creada exitosamente`);
    }
  } finally {
    callback();
  }
};

module.exports = primerCliente;
