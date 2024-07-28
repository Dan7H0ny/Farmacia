const mongoose = require('mongoose');
const Notificacion = require('../models/Notificacion');
const Almacen = require('../models/Almacen');

const crearDatos = async function(callback) {
  try {
    const almacenes = await Almacen.find();

    const notificacion = [];

    // Convertimos el array de productos en un array de objetos
    const productosDisponibles = almacenes.map(almacen => almacen._id);

    for (let i = 0; i < productosDisponibles.length; i++) {
      const producto = productosDisponibles[i];

      notificacion.push({
        producto,
        estado: false,
      });
    }

    await Notificacion.insertMany(notificacion);
    console.log('Datos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    if (callback) callback();
  }
};

module.exports = crearDatos;
