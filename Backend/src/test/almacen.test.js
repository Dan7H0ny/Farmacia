const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Almacen = require('../models/Almacen');
const Producto = require('../models/Producto');
const Complemento = require('../models/Complemento');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');

const app = express();
app.use(express.json());
app.use('/api/almacen', require('../controller/almacen'));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Almacen API', () => {
  test('Debe crear un producto en el almacén con éxito', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento A', nombre: 'Categoría A', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test', apellido: 'Apellido Test', rol: 'Administrador', correo: 'test@correo.com', password: 'password123', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca A',
      nombre_vendedor: 'Vendedor A',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const producto = await new Producto({
      nombre: 'Producto A',
      tipo: complemento._id,
      descripcion: 'Descripción del producto A',
      proveedor: proveedor._id,
      precioCompra: 50,
      capacidad_presentacion: 100,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const almacenData = {
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 75,
      cantidad_stock: 10,
      fecha_caducidad: new Date(Date.now() + 2000 * 60 * 60 * 24 * 30), // Dentro de un mes
      usuario: usuario._id
    };

    const response = await request(app)
      .post('/api/almacen/crear')
      .send(almacenData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('mensaje', 'Producto Añadido exitosamente');
    expect(response.body).toHaveProperty('almacen');
    expect(response.body.almacen).toHaveProperty('producto', producto._id.toString());
    expect(response.body.almacen).toHaveProperty('precioVenta', 75);
  });

  test('No debe permitir crear un producto en el almacén con fecha de caducidad pasada', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento B', nombre: 'Categoría B', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test 2', apellido: 'Apellido Test 2', rol: 'Cajero', correo: 'test2@correo.com', password: 'password1234', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca B',
      nombre_vendedor: 'Vendedor B',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const producto = await new Producto({
      nombre: 'Producto B',
      tipo: complemento._id,
      descripcion: 'Descripción del producto B',
      proveedor: proveedor._id,
      precioCompra: 100,
      capacidad_presentacion: 200,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const almacenData = {
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 100,
      cantidad_stock: 5,
      estado:true,
      fecha_caducidad: new Date(Date.now() - 1000 * 60 * 60 * 24), // Pasada
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    };

    const response = await request(app)
      .post('/api/almacen/crear')
      .send(almacenData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'La fecha de caducidad debe ser al menos un mes posterior al día de hoy.');
  });

  test('No debe permitir crear un producto duplicado en el almacén', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento C', nombre: 'Categoría C', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test 3', apellido: 'Apellido Test 3', rol: 'Administrador', correo: 'test3@correo.com', password: 'password12345', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca C',
      nombre_vendedor: 'Vendedor C',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const producto = await new Producto({
      nombre: 'Producto C',
      tipo: complemento._id,
      descripcion: 'Descripción del producto C',
      proveedor: proveedor._id,
      precioCompra: 150,
      capacidad_presentacion: 300,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const almacenData1 = {
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 120,
      cantidad_stock: 15,
      estado:true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // Dentro de dos meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    };

    await request(app)
      .post('/api/almacen/crear')
      .send(almacenData1);

    const almacenData2 = {
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 120,
      cantidad_stock: 10,
      estado:true,
      fecha_caducidad: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // Dentro de dos meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    };

    const response = await request(app)
      .post('/api/almacen/crear')
      .send(almacenData2);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'El producto ya está registrado en el almacén.');
  });

  test('Debe obtener todos los productos del almacén', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento D', nombre: 'Categoría D', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test 4', apellido: 'Apellido Test 4', rol: 'Cajero', correo: 'test4@correo.com', password: 'password123456', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
  
    const proveedor = await new Proveedor({
      nombre_marca: 'Marca D',
      nombre_vendedor: 'Vendedor D',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
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
  
    await new Almacen({
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
  
    const response = await request(app)
      .get('/api/almacen/mostrar'); // Cambia esto si el endpoint es diferente
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  

  test('Debe actualizar un producto en el almacén con éxito', async () => {
    const complemento = await new Complemento({ nombreComplemento: 'Complemento E', nombre: 'Categoría E', fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();
    const usuario = await new Usuario({ nombre: 'Usuario Test 5', apellido: 'Apellido Test 5', rol: 'Administrador', correo: 'test5@correo.com', password: 'password1234567', estado: true, fecha_registro: new Date(), fecha_actualizacion: new Date() }).save();

    const proveedor = await new Proveedor({
      nombre_marca: 'Marca E',
      nombre_vendedor: 'Vendedor E',
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const producto = await new Producto({
      nombre: 'Producto E',
      tipo: complemento._id,
      descripcion: 'Descripción del producto E',
      proveedor: proveedor._id,
      precioCompra: 250,
      capacidad_presentacion: 500,
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const almacen = await new Almacen({
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 200,
      cantidad_stock: 25,
      estado:true,
      fecha_caducidad: new Date(Date.now() + 1500 * 60 * 60 * 24 * 120), // Dentro de cuatro meses
      usuario_registro: usuario._id,
      usuario_actualizacion: usuario._id,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const updateData = {
      producto: producto._id,
      categoria: complemento._id,
      precioVenta: 75,
      cantidad_stock: 10,
      precioVenta: 220,
      fecha_caducidad: new Date(Date.now() + 3000 * 60 * 60 * 24 * 150), // Dentro de cinco meses
      fecha_actualizacion: new Date()
    };

    const response = await request(app)
      .put(`/api/almacen/actualizar/${almacen._id}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
  });
});