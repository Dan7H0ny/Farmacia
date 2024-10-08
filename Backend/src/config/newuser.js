const mongoose = require('mongoose')
const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')

const primerUsuario = async function(callback) {
  try {
    const usuarios = await Usuario.find({})
    const fechaActual = new Date();
    const hashedPassword = await bcryptjs.hash( process.env.PRIMER_PASSWORD, 10);
    const pin = Math.floor(100000000 + Math.random() * 900000000).toString();
    if (usuarios.length == 0) {
      await Usuario.create({
        nombre: 'Super',
        apellido: 'Admin',
        rol: 'Administrador',
        direccion: 'Av. Blanco Galindo',
        telefono: 75966914,
        carnetIdentidad: 8940180,
        correo: 'amamanih_cb@est.emi.edu.bo',
        password: hashedPassword,
        pin: pin,
        estado: true,
        fecha_registro: fechaActual,
        fecha_actualizacion: fechaActual
      })
      await Usuario.create({
        nombre: 'Empleado',
        apellido: 'Cajero',
        rol: 'Cajero',
        direccion: 'Av. Plaza Colon',
        telefono: 75975967,
        carnetIdentidad: 8058951,
        correo: 'loqendoa759@gmail.com',
        password: hashedPassword,
        pin: pin,
        estado: true,
        fecha_registro: fechaActual,
        fecha_actualizacion: fechaActual
      })
      console.log('Creado usuario admin exitosamente')
    }
  } finally {
    callback()
  }
}

const idValido = function(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

const errorBD = function(error, res) {
  if (error.code == 11000) {
    let errors = [
      {
        value: error.keyValue[Object.keys(error.keyValue)[0]],
        msg: 'No se permiten duplicados',
        param: Object.keys(error.keyValue)[0],
        location: 'body'
      }
    ]
    return res.status(422).json({
      error: true,
      mensaje: 'Registro duplicado',
      datos: errors
    })
  } else if (error.name === "ValidationError") {
    let errors = []
    Object.keys(error.errors).forEach((key) => {
      errors.push({
        value: null,
        msg: 'Campo requerido',
        param: key,
        location: 'body'
      })
    })
    return res.status(422).json({
      error: true,
      mensaje: 'Registro inválido',
      datos: errors
    })
  } else {
    console.log(error)
    return res.status(500).json({
      error: true,
      mensaje: 'Error en el servidor',
      datos: []
    })
  }
}
exports.primerUsuario = primerUsuario
exports.idValido = idValido
exports.errorBD = errorBD