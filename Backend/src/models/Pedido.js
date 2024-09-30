const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
    },
    nombre: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      required: true
    },
    proveedor: {
      type: String,
      required: true
    },
    cantidad_producto: {
      type: Number,
      required: true
    },
    precioCompra: {
      type: Number,
      required: true
    },
  }],
  precio_total:{
    type: Number,
    required: true
  },
  estado:{
    type: String,
    required: true
  },
  imagenPrueba: {
    type: String,
    required: false
  },
  imagenVerificado: {
    type: String,
    required: false
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

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
