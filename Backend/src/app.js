const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const utiles = require('./config/newuser')
const crearDatos  = require('./config/cargar-venta')
require('dotenv').config();

app.set('key', process.env.TOKEN_LLAVE);
app.use(cors());

app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/',require('./controller/autentificacion'));
app.use('/complemento', require('./controller/complemento'));
app.use('/almacen', require('./controller/almacen'));
app.use('/usuario', require('./controller/usuarios'));
app.use('/cliente', require('./controller/clientes'));
app.use('/proveedor', require('./controller/proveedores'));
app.use('/producto', require('./controller/productos'));
app.use('/venta', require('./controller/ventas'));
app.use('/prediccion', require('./controller/prediccion'));

mongoose.connect(process.env.BD_CONEXION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a la base de datos')
  utiles.primerUsuario(function() {
    app.listen(process.env.PUERTO_HTTP, process.env.PUERTO_IP_URL, () => {
      console.log(`Servidor iniciado en el puerto ${process.env.PUERTO_HTTP}`)
      // crearDatos(() => {
      //   console.log('Proceso de creación de complementos');
      // });
    })
  })
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
})
