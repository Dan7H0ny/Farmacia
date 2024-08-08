const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  prediccion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediccion',
  },
  estado: {
    type: Boolean,
    required: true,
  },
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
module.exports = Notificacion;
