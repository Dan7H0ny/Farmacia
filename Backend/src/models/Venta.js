const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
    },
    cantidad_producto: {
      type: Number,
      required: true
    },
  }],
  precio_total: {
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
  },
  usuario_registra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  usuario_update: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  }
});

const Venta = mongoose.model('Venta', ventaSchema);
module.exports = Venta;
