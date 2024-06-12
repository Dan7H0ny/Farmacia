const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria'
  },
  tipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipo'
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  capacidad: {
    type: Number,
    required: true,
    min: 0
  },
  capacidad_pres: {
    type: Number,
    required: true,
    min: 0
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  estado: {
    type: Boolean,
    required: true
  },
  fecha_caducidad: {
    type: Date,
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

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
