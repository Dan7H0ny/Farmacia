const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  venta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
module.exports = Notificacion;
