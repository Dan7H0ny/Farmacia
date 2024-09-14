const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto'
  },
  cantidad_total:{
    type: Number,
    required: true
  },
  precio_total:{
    type: Number,
    required: true
  },
  estado:{
    type: String,
    required: true
  },
  fecha_registro: {
    type: Date,
    required: true
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
