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
    type: String,
    required: true
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  capacidad_caja: {
    type: Number,
    required: true,
    min: 0
  },
  capacidad_unitaria: {
    type: Number,
    required: false,
    min: 0
  },
  precio_por_menor: {
    type: Number,
    required: true,
    min: 0
  },
  precio_por_mayor: {
    type: Number,
    required: true,
    min: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
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
