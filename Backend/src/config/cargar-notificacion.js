const mongoose = require('mongoose');
const Notificacion = require('../models/Notificacion');
const Prediccion = require('../models/Prediccion');

const crearDatos = async function(callback) {
  try {
    // Obtener todas las predicciones disponibles
    const predicciones = await Prediccion.find();

    // Crear un array para almacenar las notificaciones a insertar
    const notificaciones = predicciones.map(prediccion => ({
      prediccion: prediccion._id, // Relaciona la notificación con la predicción
      estado: false, // Establece el estado inicial como false
    }));

    // Insertar todas las notificaciones creadas en la colección de Notificaciones
    await Notificacion.insertMany(notificaciones);

    console.log('Notificaciones insertadas correctamente');
  } catch (error) {
    console.error('Error al insertar las notificaciones:', error);
  } finally {
    if (callback) callback();
  }
};

module.exports = crearDatos;

