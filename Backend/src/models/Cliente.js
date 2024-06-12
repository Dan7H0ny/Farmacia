const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
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
  },
  sexo: {
    type: String,
    required: true,
  },
  nit_ci_cex: {
    type: Number,
    required: true
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

