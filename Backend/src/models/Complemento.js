const mongoose = require('mongoose');

const complementoSchema = new mongoose.Schema({
  nombreComplemento: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  limiteComplemento: {
    type: Number,
    required: false,
    default: 0,
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
const Complemento = mongoose.model('Complemento', complementoSchema);

module.exports = Complemento;

