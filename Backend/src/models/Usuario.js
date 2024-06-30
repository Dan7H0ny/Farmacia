const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: false
  },
  telefono: {
    type: Number,
    required: false
  },
  correo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
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
const Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;

