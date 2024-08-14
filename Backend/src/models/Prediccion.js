const mongoose = require('mongoose');

const prediccionSchema = new mongoose.Schema({
  productos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Almacen'
  },
  nombreCategoria: { 
    type: String,
    required: true
  },
  nombreProducto: { 
    type: String,
    required: true
  },
  prediccion: {
    ventas: {
      type: [Number], 
      required: true
    },
    stockRestante: {
      type: Number, 
      required: true
    }
  },
  diaAgotamiento: {
    type: Number, 
    optional: true
  },
  datosHistoricos:{
    type: Number, 
    optional: true
  },
  porcentajeError: { 
    type: Number,
    required: true
  }
});

// Crear el modelo basado en el esquema
const Prediccion = mongoose.model('Prediccion', prediccionSchema);

module.exports = Prediccion;
