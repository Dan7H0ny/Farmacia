const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: false,
  },
  telefono: {
    type: Number,
    required: false,
    min: 0,
  },
  numberIdentity: {
    type: Number,
    required: true,
    min: 0,
  },
  plus: {
    type: Number,
    required: false,
    min: 0,
  },
  combinedIdentity: {
    type: String,
    required: false,
  },
  extension: {
    type: String,
    required: false,
  },
  stringIdentity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complemento'
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

clienteSchema.pre('save', function(next) {
  if (this.plus !== undefined && this.plus !== null) {
    this.combinedIdentity = `${this.numberIdentity}-${this.plus}`;
  } else {
    this.combinedIdentity = `${this.numberIdentity}`;
  }
  next();
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;
