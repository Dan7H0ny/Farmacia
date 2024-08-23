const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express'); // Asegúrate de requerir express
const Cliente = require('../models/Cliente');
const Almacen = require('../models/Almacen');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');
const Complemento = require('../models/Complemento');
const Proveedor = require('../models/Proveedor');
const ventasRouter = require('../controller/ventas'); // Importa el controlador de ventas

let mongoServer;
let app; // Definir la aplicación fuera del scope de los tests para reuso

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Inicializa la aplicación Express y usa el router de ventas
  app = express();
  app.use(express.json());
  app.use('/ventas', ventasRouter); // Usa el router de ventas
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Limpia todas las colecciones antes de cada prueba
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Controlador de Ventas', () => {
  it('debería crear una venta', async () => {

    const complemento = await new Complemento({ nombreComplemento: 'Complemento A', nombre: 'Categoría A', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test', apellido: 'Apellido Test', rol: 'Administrador', correo: 'test@correo.com', password: 'password123', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca A',
      nombre_vendedor: 'Vendedor A',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();
    // Crea un cliente de prueba
    const cliente = await new Cliente({
      nombreCompleto: 'John Doe',
      numberIdentity: 123456,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
    }).save();

    const producto = await new Producto({
      nombre: 'Producto D',
      tipo: complemento._id,
      descripcion: 'Descripción del producto D',
      proveedor: proveedor._id,
      precioCompra: 200,
      capacidad_presentacion: 400,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Crea un producto en el almacén de prueba
    const almacen = await new Almacen({
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 150,
      cantidad_stock: 20,
      estado: true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // Dentro de tres meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const ventaData = {
      cliente: cliente._id,
      productos: [
        {
          producto: almacen._id,
          nombre: 'Producto 1',
          tipo: 'Tipo 1',
          proveedor: 'Proveedor 1',
          categoria: 'Categoría 1',
          cantidad_producto: 2,
          precio_venta: 10,
        },
      ],
      precio_total: 20,
      usuario: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    };

    const res = await request(app).post('/ventas/crear').send(ventaData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Venta creada exitosamente');
    expect(res.body.venta).toHaveProperty('_id');
  });

  it('debería obtener todas las ventas', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento A', nombre: 'Categoría A', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test', apellido: 'Apellido Test', rol: 'Administrador', correo: 'test@correo.com', password: 'password123', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca A',
      nombre_vendedor: 'Vendedor A',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();
    // Crea un cliente de prueba
    const cliente = await new Cliente({
      nombreCompleto: 'John Doe',
      numberIdentity: 123456,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
    }).save();

    const producto = await new Producto({
      nombre: 'Producto D',
      tipo: complemento._id,
      descripcion: 'Descripción del producto D',
      proveedor: proveedor._id,
      precioCompra: 200,
      capacidad_presentacion: 400,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Crea un producto en el almacén de prueba
    const almacen = await new Almacen({
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 150,
      cantidad_stock: 20,
      estado: true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // Dentro de tres meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const venta = new Venta({
      cliente: cliente._id,
      productos: [
        {
          producto: almacen._id,
          nombre: 'Producto 1',
          tipo: 'Tipo 1',
          proveedor: 'Proveedor 1',
          categoria: 'Categoría 1',
          cantidad_producto: 2,
          precio_venta: 10,
        },
      ],
      precio_total: 20,
      usuario: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    });
    await venta.save();

    const res = await request(app).get('/ventas/mostrar');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('debería buscar una venta por ID', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento A', nombre: 'Categoría A', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test', apellido: 'Apellido Test', rol: 'Administrador', correo: 'test@correo.com', password: 'password123', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca A',
      nombre_vendedor: 'Vendedor A',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();
    // Crea un cliente de prueba
    const cliente = await new Cliente({
      nombreCompleto: 'John Doe',
      numberIdentity: 123456,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
    }).save();

    const producto = await new Producto({
      nombre: 'Producto D',
      tipo: complemento._id,
      descripcion: 'Descripción del producto D',
      proveedor: proveedor._id,
      precioCompra: 200,
      capacidad_presentacion: 400,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Crea un producto en el almacén de prueba
    const almacen = await new Almacen({
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 150,
      cantidad_stock: 20,
      estado: true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // Dentro de tres meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const venta = new Venta({
      cliente: cliente._id,
      productos: [
        {
          producto: almacen._id,
          nombre: 'Producto 1',
          tipo: 'Tipo 1',
          proveedor: 'Proveedor 1',
          categoria: 'Categoría 1',
          cantidad_producto: 2,
          precio_venta: 10,
        },
      ],
      precio_total: 20,
      usuario: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    });
    await venta.save();

    const res = await request(app).get(`/ventas/buscar/${venta._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', venta._id.toString());
  });

  it('debería actualizar una venta', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento A', nombre: 'Categoría A', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test', apellido: 'Apellido Test', rol: 'Administrador', correo: 'test@correo.com', password: 'password123', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca A',
      nombre_vendedor: 'Vendedor A',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();
    // Crea un cliente de prueba
    const cliente = await new Cliente({
      nombreCompleto: 'John Doe',
      numberIdentity: 123456,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
    }).save();

    const producto = await new Producto({
      nombre: 'Producto D',
      tipo: complemento._id,
      descripcion: 'Descripción del producto D',
      proveedor: proveedor._id,
      precioCompra: 200,
      capacidad_presentacion: 400,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Crea un producto en el almacén de prueba
    const almacen = await new Almacen({
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 150,
      cantidad_stock: 20,
      estado: true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // Dentro de tres meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const venta = new Venta({
      cliente: cliente._id,
      productos: [
        {
          producto: almacen._id,
          nombre: 'Producto 1',
          tipo: 'Tipo 1',
          proveedor: 'Proveedor 1',
          categoria: 'Categoría 1',
          cantidad_producto: 2,
          precio_venta: 10,
        },
      ],
      precio_total: 20,
      usuario: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    });
    await venta.save();

    const res = await request(app)
      .put(`/ventas/actualizar/${venta._id}`)
      .send({ cliente: cliente._id,
        productos: [
          {
            producto: almacen._id,
            nombre: 'Producto 1',
            tipo: 'Tipo 1',
            proveedor: 'Proveedor 1',
            categoria: 'Categoría 1',
            cantidad_producto: 2,
            precio_venta: 10,
          },
        ],
        precio_total: 10,
        fecha_actualizacion: new Date(),
        usuario_update: usuario});
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Venta actualizada exitosamente');
  });
});
