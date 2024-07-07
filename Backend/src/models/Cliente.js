const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: false,
  },
  telefono: {
    type: Number,
    required: false,
    min: 0,
  },
  numberIdentity: {
    type: Number,
    required: true,
    min: 0,
  },
  stringIdentity: {
    type: String,
    required: true
  },
  usuario_registro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  usuario_actualizacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
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
const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;

