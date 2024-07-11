const mongoose = require('mongoose');

const almacenSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto'
  },
  categoria: {
    type: String,
    required: false
  },
  precioVenta: {
    type: Number,
    required: true,
    min: 0
  },
  cantidad_stock: {
    type: Number,
    required: true,
  },
  estado: {
    type: Boolean,
    required: true
  },
  fecha_caducidad: {
    type: Date,
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
const Almacen = mongoose.model('Almacen', almacenSchema);

module.exports = Almacen;

