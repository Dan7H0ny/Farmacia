const mongoose = require('mongoose');
const cargarComplementos = require('../config/cargar-complementos');
const cargarProveedores = require('../config/cargar-proveedores');
const cargarClientes = require('../config/cargar-clientes');
const cargarProductos = require('../config/cargar-productos');
const cargarAlmacen = require('../config/cargar-almacen');
const cargarVentas = require('../config/cargar-venta');

const cargarDatosSiVacio = async () => {
  try {
    await cargarComplementos(() => {
      console.log('Proceso de creación de proveedores');
    });
    await cargarProveedores(() => {
      console.log('Proceso de creación de proveedores');
    });
    await cargarClientes(() => {
      console.log('Proceso de creación de clientes');
    });
    await cargarProductos(() => {
      console.log('Proceso de creación de productos');
    });
    await cargarAlmacen(() => {
      console.log('Proceso de creación de almacen');
    });
    await cargarVentas(() => {
      console.log('Proceso de creación de ventas');
    });
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
};

// Llama a la función para cargar los datos si las colecciones están vacías
cargarDatosSiVacio();

module.exports = cargarDatosSiVacio;
