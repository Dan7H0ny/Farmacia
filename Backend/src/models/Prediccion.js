const mongoose = require('mongoose');

const prediccionSchema = new mongoose.Schema({
  notificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notificacion',
  },
  nombreProducto: {
    type: String,
    required: true
  },
  prediccion: {
    ventas: {
      type: [Number], // Supongo que "ventas" es un número que indica la cantidad de ventas previstas
      required: true
    },
    stockRestante: {
      type: Number, // Supongo que "stockRestante" es un número que indica la cantidad de stock restante
      required: true
    }
  },
  diaAgotamiento: {
    type: Number, // Supongo que "diaAgotamiento" es la fecha cuando se prevé que el producto se agotará
    required: false
  }
});

// Crear el modelo basado en el esquema
const Prediccion = mongoose.model('Prediccion', prediccionSchema);

module.exports = Prediccion;
