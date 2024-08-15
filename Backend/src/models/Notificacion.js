const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  notificaciones: [{
    prediccion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediccion',
    },
    estado: {
      type: Boolean,
      required: true,
    },
  }],
  token: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true  // Opcional: guarda automáticamente la fecha de creación y actualización de cada documento
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
module.exports = Notificacion;