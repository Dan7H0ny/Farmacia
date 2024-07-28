const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Almacen',
  },
  estado: {
    type: Boolean,
    required: true,
  },
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
module.exports = Notificacion;
