const mongoose = require('mongoose');
const Complemento = require('../models/Complemento');

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);

  const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
  return fechaAleatoria;
};

const crearDatos = async () => {
  const identificacion = ['NIT', 'Carnet de Identidad', 'CEX'];
  const tipo = ['Cajas', 'Paquetes', 'Docenas', 'Botellas'];
  const categoria = [
    'Medicamentos con receta', 'Medicamentos de venta libre (OTC)', 'Suplementos vitamínicos y minerales',
    'Productos para el cuidado de la piel', 'Productos para el cuidado del cabello', 'Productos para el cuidado bucal',
    'Productos para bebés', 'Productos de primeros auxilios', 'Equipo médico y suministros', 'Productos para el control de peso'
  ];

  const complementos = [];

  // Crear datos para 'Identificación'
  identificacion.forEach(nombre => {
    const fechaRegistro = generarFechaAleatoria();
    const fechaActualizacion = new Date(fechaRegistro);
    fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

    complementos.push({
      nombreComplemento: 'Identificación',
      nombre: nombre,
      fecha_registro: fechaRegistro,
      fecha_actualizacion: fechaActualizacion
    });
  });

  // Crear datos para 'Tipo'
  tipo.forEach(nombre => {
    const fechaRegistro = generarFechaAleatoria();
    const fechaActualizacion = new Date(fechaRegistro);
    fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

    complementos.push({
      nombreComplemento: 'Tipo',
      nombre: nombre,
      fecha_registro: fechaRegistro,
      fecha_actualizacion: fechaActualizacion
    });
  });

  // Crear datos para 'Categoría'
  categoria.forEach(nombre => {
    const fechaRegistro = generarFechaAleatoria();
    const fechaActualizacion = new Date(fechaRegistro);
    fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

    complementos.push({
      nombreComplemento: 'Categoría',
      nombre: nombre,
      fecha_registro: fechaRegistro,
      fecha_actualizacion: fechaActualizacion
    });
  });

  await Complemento.insertMany(complementos);
  console.log('Datos insertados correctamente');
};

module.exports = crearDatos;
