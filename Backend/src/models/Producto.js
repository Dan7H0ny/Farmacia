const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  precioCompra: {
    type: Number,
    required: true,
    min: 0
  },
  capacidad_presentacion: {
    type: Number,
    required: true,
    min: 0
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

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
