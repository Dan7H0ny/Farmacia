const mongoose = require('mongoose');
const Proveedor = require('../models/Proveedor');

const nombresMarca = [
  'Johnson & Johnson', 'Roche', 'Pfizer', 'Merck & Co.', 'AstraZeneca',
  'Bayer', 'Sanofi', 'AbbVie', 'Novartis', 'GlaxoSmithKline',
  'Amgen', 'Gilead Sciences', 'Bristol Myers Squibb', 'Eli Lilly', 'Teva Pharmaceutical',
  'Regeneron Pharmaceuticals', 'Allergan', 'Biogen', 'Celgene', 'Inti',
  'Bago', 'Merck KGaA', 'Novo Nordisk', 'Takeda Pharmaceutical', 'Sinopharm'
];

const generarFechaAleatoria = function() {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);

  const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
  return fechaAleatoria;
};

const crearDatos = async function(callback) {
  try {
    const proveedores = nombresMarca.map(nombreMarca => {
      const nombreVendedor = generarNombreVendedor();
      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = new Date(fechaRegistro);
      fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

      return {
        nombre_marca: nombreMarca,
        correo: '',
        telefono: null,
        sitioweb: '',
        nombre_vendedor: nombreVendedor,
        correo_vendedor: '',
        celular: null,
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion
      };
    });

    await Proveedor.insertMany(proveedores);
    console.log('Datos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    callback();
  }
};

module.exports = crearDatos;
