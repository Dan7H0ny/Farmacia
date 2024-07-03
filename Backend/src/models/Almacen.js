const mongoose = require('mongoose');

const almacenSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto'
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

