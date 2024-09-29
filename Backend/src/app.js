const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//const cargarDatos = require('./config/cargar-complementos');
//const cargarProveedores = require('./config/cargar-proveedores');
//const crearProductos = require('./config/cargar-productos');
//const cargarAlmacen = require('./config/cargar-almacen');
//const cargarClientes = require('./config/cargar-clientes');
//const cargarVentas = require('./config/cargar-venta');
const utiles = require('./config/newuser');
require('dotenv').config();
app.set('key', process.env.TOKEN_LLAVE);
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Configuración de rutas existentes
app.use('/api', require('./controller/autentificacion'));
app.use('/api/complemento', require('./controller/complemento'));
app.use('/api/almacen', require('./controller/almacen'));
app.use('/api/usuario', require('./controller/usuarios'));
app.use('/api/cliente', require('./controller/clientes'));
app.use('/api/proveedor', require('./controller/proveedores'));
app.use('/api/producto', require('./controller/productos'));
app.use('/api/venta', require('./controller/ventas'));
app.use('/api/prediccion', require('./controller/prediccion'));
app.use('/api/notificacion', require('./controller/notificacion'));
app.use('/api/pedidos', require('./controller/pedidos'));

// Conéctate a MongoDB usando la URI definida
mongoose.connect(process.env.BD_CONEXION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Conectado a la base de datos');
  //await cargarDatos();
  //await cargarProveedores();
  //await crearProductos();
  //await cargarAlmacen();
  //await cargarClientes();
  //await cargarVentas();
  utiles.primerUsuario(() => {
    app.listen(process.env.PUERTO_HTTP, '0.0.0.0',() => {
      console.log(`Servidor iniciado en el puerto ${process.env.PUERTO_HTTP}`);
    });
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});