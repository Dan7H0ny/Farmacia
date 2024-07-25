const mongoose = require('mongoose');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Complemento = require('../models/Complemento');

const generarNombreCompleto = function() {
  const nombreCompleto = [
    'Maria Prado Giraldo', 'Jose Antonio Tejada', 'Joaquina Barba', 'Ainara Villar', 'Fernanda Matas', 
    'Santos Macias', 'Pablo Jose Linares', 'Pilar Vivas', 'Jose Daniel Buendia', 'Nabil Pascual', 
    'Maria Alicia Castaño', 'Jose Ignacio Olmedo', 'Pedro Luis Ripoll', 'Mirian Guevara', 'Laila Garca', 
    'Fernando Betancor', 'Ruth Parra', 'Meritxell Cordoba', 'Patricio Rueda', 'Raquel Vergara', 
    'Luca Lucena', 'Estefania Salguero', 'Alexis Medrano', 'Feliciano Paniagua', 'Amadeo del Olmo',
    'Elsa Vilches', 'Lola Bustos', 'Alfonso Miguez', 'Valeriano Rosales', 'Iban Cantero', 
    'Rafael Luna', 'Ferran Domingo', 'Avelino Salmeron', 'Miriam Frutos', 'Saida Zamora', 
    'Adrian Morcillo', 'Estefania Miralles', 'Saul Alfonso', 'Valentin Prats', 'Maria Carmen Francisco', 
    'Erika Bejarano', 'Blanca Segarra', 'Jennifer Benito', 'Nabil Amor', 'Igor Alvarez', 
    'Maria Consolacion Garces', 'Alejandra Bustamante', 'Carmen Rosa Gascon', 'Aitana Muñiz', 'Dario Da-Silva'
  ];
  return nombreCompleto[Math.floor(Math.random() * nombreCompleto.length)];
};

const generarCorreo = function(nombreCompleto) {
  const dominios = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const nombre = nombreCompleto.split(' ')[0].toLowerCase();
  const apellido = nombreCompleto.split(' ')[1].toLowerCase();
  return `${nombre}.${apellido}@${dominios[Math.floor(Math.random() * dominios.length)]}`;
};

const generarNumberIdentity = function() {
  const length = Math.floor(Math.random() * 5) + 8; // Genera un número entre 8 y 12
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generarUsuario = async function() {
  const usuarios = await Usuario.find();
  return usuarios[Math.floor(Math.random() * usuarios.length)]._id;
};

const generarStringIdentity = async function() {
    const complementos = await Complemento.find({ nombreComplemento: 'Identificación' });
    if (complementos.length === 0) {
      return null;
    }
    return complementos[Math.floor(Math.random() * complementos.length)]._id;
  };

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);

  const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
  return fechaAleatoria;
};

const crearDatos = async function(callback) {
  try {
    const clientes = [];

    for (let i = 0; i < 250; i++) {
      const nombreCompleto = generarNombreCompleto();
      const correo = generarCorreo(nombreCompleto);
      const numberIdentity = generarNumberIdentity();
      const stringIdentity = await generarStringIdentity();
      const usuarioRegistro = await generarUsuario();
      const usuarioActualizacion = await generarUsuario();
      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = new Date(fechaRegistro);
      fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

      clientes.push({
        nombreCompleto,
        correo,
        telefono:null,
        numberIdentity,
        plus:null,
        combinedIdentity: numberIdentity,
        stringIdentity,
        extension: '',
        usuario_registro: usuarioRegistro,
        usuario_actualizacion: usuarioActualizacion,
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion
      });
    }

    await Cliente.insertMany(clientes);
    console.log('Datos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    callback();
  }
};

module.exports = crearDatos;
