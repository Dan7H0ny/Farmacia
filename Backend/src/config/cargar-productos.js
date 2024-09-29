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

// Función para generar una fecha aleatoria entre el último mes y la fecha actual
const generarFechaAleatoria = () => {
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);

  return new Date(fechaInicio.getTime() + Math.random() * (fechaActual.getTime() - fechaInicio.getTime()));
};

// Función para generar una cantidad aleatoria de presentación
const generarCantidadPresentacion = () => Math.floor(Math.random() * (250 - 10 + 1)) + 10;

// Función para generar un precio de compra aleatorio con 1 decimal
const generarPrecioCompra = () => Math.round((Math.random() * (100 - 2) + 2) * 10) / 10;

const crearProductos = async () => {
  try {
    const usuarios = await Usuario.find();
    const proveedores = await Proveedor.find();
    const tipos = await Complemento.find({ nombreComplemento: 'Tipo' });

    // Validaciones para asegurarse de que haya datos disponibles
    if (!usuarios.length || !proveedores.length) {
      throw new Error('No hay usuarios o proveedores disponibles para asignar a los productos.');
    }

    const productos = nombresProducto.map(nombreProducto => {
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

      return {
        insertOne: {
          document: new Producto({
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
          })
        }
      };
    });

    if (productos.length) {
      // Uso de bulkWrite para manejar las inserciones masivas y optimizar el proceso
      await Producto.bulkWrite(productos);
      console.log('Datos insertados correctamente');
    } else {
      console.log('No hay productos para insertar.');
    }
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  }
};

module.exports = crearProductos;