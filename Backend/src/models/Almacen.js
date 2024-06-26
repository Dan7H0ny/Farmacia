const mongoose = require('mongoose');

const almacenSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  fecha_registro: {
    type: Date,
    required: true
  },
  fecha_actualizacion: {
    type: Date,
    required: true
  }
});
const Almacen = mongoose.model('Almacen', almacenSchema);

module.exports = Almacen;

