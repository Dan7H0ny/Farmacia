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

const generarNombreVendedor = function() {
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

const cargarProveedores = async function(callback) {
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

module.exports = cargarProveedores;
