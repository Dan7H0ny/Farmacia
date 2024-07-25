const mongoose = require('mongoose');
const Proveedor = require('../models/Proveedor');
const Complemento = require('../models/Complemento');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

const nombresProducto = [
  'Aspirina', 'Lipitor', 'Humira', 'Nexium', 'Plavix',
  'Advil', 'Synthroid', 'Crestor', 'Ventolin', 'Januvia',
  'Lantus', 'Tamiflu', 'Herceptin', 'Enbrel', 'Remicade',
  'Rituxan', 'Avastin', 'Neulasta', 'Rebif', 'Copaxone',
  'Gardasil', 'Zytiga', 'Xarelto', 'Eliquis', 'Stelara',
  'Seroquel', 'Prozac', 'Viagra', 'Zoloft', 'Celebrex',
  'Gleevec', 'Lyrica', 'Atripla', 'Botox', 'Vioxx',
  'Accutane', 'Adderall', 'Ambien', 'Amoxicillin', 'Cymbalta',
  'Diovan', 'Fosamax', 'Lasix', 'Metformin', 'Norvasc',
  'Omeprazole', 'Paxil', 'Pradaxa', 'Premarin', 'Risperdal',
  'Sildenafil', 'Simvastatin', 'Singulair', 'Trazodone', 'Valium',
  'Valsartan', 'Warfarin', 'Wellbutrin', 'Zetia', 'Zocor',
  'Hydrochlorothiazide', 'Ibuprofen', 'Levothyroxine', 'Lisinopril', 'Lorazepam',
  'Metoprolol', 'Naloxone', 'Naproxen', 'Nitroglycerin', 'Oxycodone',
  'Paracetamol', 'Phenytoin', 'Prednisone', 'Quetiapine', 'Ramipril',
  'Ranitidine', 'Salbutamol', 'Sertraline', 'Sulfamethoxazole', 'Tacrolimus',
  'Tamsulosin', 'Thyroxine', 'Tramadol', 'Tretinoin', 'Triamcinolone',
  'Vardenafil', 'Venlafaxine', 'Verapamil', 'Zolpidem', 'Aripiprazole',
  'Atorvastatin', 'Azithromycin', 'Bisoprolol', 'Citalopram', 'Clonazepam',
  'Clopidogrel', 'Dexamethasone', 'Doxycycline', 'Escitalopram', 'Fluconazole'
];


const generarUsuario = async function() {
  const usuarios = await Usuario.find();
  return usuarios[Math.floor(Math.random() * usuarios.length)]._id;
};
const generarProveedor = async function() {
  const proveedores = await Proveedor.find();
  return proveedores[Math.floor(Math.random() * proveedores.length)]._id;
};

const generarTipoPresentacion = async function() {
  const complementos = await Complemento.find({ nombreComplemento: 'Tipo' });
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

const generarCantidadPresentacion = function() {
  const min = 10;
  const max = 250;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generarPrecioCompra = function() {
  const min = 2;
  const max = 100;
  const precio = Math.random() * (max - min) + min;
  return Math.round(precio * 10) / 10;
};

const crearDatos = async function(callback) {
  try {
    const usuarios = await Usuario.find();
    const proveedores = await Proveedor.find();
    const tipos = await Complemento.find({ nombreComplemento: 'Tipo' });

    const productos = await Promise.all(nombresProducto.map(async nombreProducto => {
      const usuarioIndex = Math.floor(Math.random() * usuarios.length);
      const proveedorIndex = Math.floor(Math.random() * proveedores.length);
      const tipoIndex = tipos.length ? Math.floor(Math.random() * tipos.length) : null;

      const usuario_ = usuarios[usuarioIndex]._id;
      const proveedor_ = proveedores[proveedorIndex]._id;
      const tipo_ = tipoIndex !== null ? tipos[tipoIndex]._id : null;

      const precioCompra_ = generarPrecioCompra();
      const cantidad = generarCantidadPresentacion();
      const fechaRegistro = generarFechaAleatoria();
      const fechaActualizacion = new Date(fechaRegistro);
      fechaActualizacion.setDate(fechaActualizacion.getDate() + Math.floor(Math.random() * 30));

      return new Producto({
        nombre: nombreProducto,
        tipo: tipo_,
        descripcion: '',
        proveedor: proveedor_,
        precioCompra: precioCompra_,
        capacidad_presentacion: cantidad,
        usuario_registro: usuario_,
        usuario_actualizacion: usuario_,
        fecha_registro: fechaRegistro,
        fecha_actualizacion: fechaActualizacion
      });
    }));

    await Producto.insertMany(productos);
    console.log('Datos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    if (callback) callback();
  }
};


module.exports = crearDatos;

