const mongoose = require('mongoose');

const tipoSchema = new mongoose.Schema({
  nombreTipo: {
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
const Tipo = mongoose.model('Tipo', tipoSchema);

module.exports = Tipo;

