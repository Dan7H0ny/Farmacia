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
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;

