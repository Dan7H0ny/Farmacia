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
  }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);
module.exports = Proveedor;
