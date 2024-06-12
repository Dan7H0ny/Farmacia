const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre_marca: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: false
  },
  telefono: {
    type: Number,
    required: false
  },
  sitioweb: {
    type: String,
    required: false
  },
  nombre_vendedor: {
    type: String,
    required: true
  },
  correo_vendedor: {
    type: String,
    required: false
  },
  celular: {
    type: Number,
    required: false
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

const Proveedor = mongoose.model('Proveedor', proveedorSchema);
module.exports = Proveedor;
