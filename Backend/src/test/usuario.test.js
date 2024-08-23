const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Usuario = require('../models/Usuario'); // Ajusta la ruta al archivo del modelo

const app = express();
app.use(express.json());
app.use('/api/usuarios', require('../controller/usuarios'));

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

describe('Usuarios API', () => {
  test('Debe crear un usuario con éxito', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'Cajero',
      direccion: '123 Calle Falsa',
      telefono: 1234567890,
      correo: 'juan.perez@example.com',
      password: 'contraseña123'
    };

    // Log de datos de entrada
    console.log(`Solicitud enviada: POST /api/usuarios/crear - ${JSON.stringify(usuarioData)}`);
    
    const response = await request(app)
      .post('/api/usuarios/crear')
      .send(usuarioData);

    // Log de respuesta
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('mensaje', 'Usuario creado exitosamente');
    expect(response.body).toHaveProperty('usuario');
    expect(response.body.usuario).toHaveProperty('nombre', 'Juan');
    expect(response.body.usuario).toHaveProperty('correo', 'juan.perez@example.com');
  });  

  test('No debe permitir crear un usuario con un correo duplicado', async () => {
    const usuarioData1 = {
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'Cajero',
      direccion: '123 Calle Falsa',
      telefono: 1234567890,
      correo: 'duplicado@example.com',
      password: 'contraseña123'
    };

    // Log de datos de entrada
    console.log(`Solicitud enviada para crear usuario con correo duplicado: POST /api/usuarios/crear - ${JSON.stringify(usuarioData1)}`);
    
    await request(app)
      .post('/api/usuarios/crear')
      .send(usuarioData1);

    const usuarioData2 = {
      nombre: 'Ana',
      apellido: 'Gómez',
      rol: 'Cajero',
      direccion: '456 Otra Calle',
      telefono: 75969491,
      correo: 'duplicado@example.com',
      password: 'otraContraseña123'
    };

    // Log de datos de entrada
    console.log(`Solicitud enviada para crear usuario con correo duplicado: POST /api/usuarios/crear - ${JSON.stringify(usuarioData2)}`);
    
    const response = await request(app)
      .post('/api/usuarios/crear')
      .send(usuarioData2);

    // Log de respuesta
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'El correo ya está registrado, ingrese otro correo distinto');
  });

  test('Debe obtener todos los usuarios', async () => {
    const usuarioData = {
      nombre: 'Maria',
      apellido: 'Lopez',
      rol: 'Cajero',
      direccion: '789 Calle Nueva',
      telefono: 9876543210,
      correo: 'maria.lopez@example.com',
      password: 'contraseña456'
    };

    // Crear un usuario antes de obtener todos
    await request(app)
      .post('/api/usuarios/crear')
      .send(usuarioData);

    // Log de solicitud para obtener todos los usuarios
    console.log('Solicitud enviada: GET /api/usuarios/mostrar');
    
    const response = await request(app).get('/api/usuarios/mostrar');
    
    // Log de respuesta
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Debe obtener un usuario por ID', async () => {
    const usuario = await new Usuario({
      nombre: 'Carlos',
      apellido: 'Mendoza',
      rol: 'Cajero',
      direccion: '321 Calle Vieja',
      telefono: 1112233445,
      correo: 'carlos.mendoza@example.com',
      password: 'contraseña789',
      estado: true,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Log de datos del usuario creado
    console.log(`Usuario creado para obtener por ID: ${JSON.stringify(usuario)}`);
    
    const response = await request(app).get(`/api/usuarios/buscar/${usuario._id}`);
    
    // Log de solicitud y respuesta
    console.log(`Solicitud enviada: GET /api/usuarios/buscar/${usuario._id}`);
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nombre', 'Carlos');
    expect(response.body).toHaveProperty('correo', 'carlos.mendoza@example.com');
  });

  test('Debe actualizar un usuario', async () => {
    const usuario = await new Usuario({
      nombre: 'Laura',
      apellido: 'Ramirez',
      rol: 'Administrador',
      direccion: '654 Calle Central',
      telefono: 5566778899,
      correo: 'laura.ramirez@example.com',
      password: 'contraseña101',
      estado: true,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    const updateData = {
      nombre: 'Laura',
      apellido: 'Ramirez',
      rol: 'Administrador',
      direccion: '654 Calle Central Actualizada',
      telefono: 5566778899,
      correo: 'laura.ramirez@example.com',
      password: ''
    };

    // Log de datos del usuario antes de la actualización
    console.log(`Usuario creado para actualizar: ${JSON.stringify(usuario)}`);
    
    const response = await request(app)
      .put(`/api/usuarios/actualizar/${usuario._id}`)
      .send(updateData);

    // Log de solicitud y respuesta
    console.log(`Solicitud enviada: PUT /api/usuarios/actualizar/${usuario._id} - ${JSON.stringify(updateData)}`);
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Usuario actualizado exitosamente');
    expect(response.body).toHaveProperty('usuarioActualizado');
    expect(response.body.usuarioActualizado).toHaveProperty('direccion', '654 Calle Central Actualizada');
  });

  test('Debe eliminar un usuario', async () => {
    const usuario = await new Usuario({
      nombre: 'Pedro',
      apellido: 'Sanchez',
      rol: 'Administrador',
      direccion: '987 Calle Final',
      telefono: 2233445566,
      correo: 'pedro.sanchez@example.com',
      password: 'contraseña202',
      estado: true,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date()
    }).save();

    // Log de datos del usuario antes de la eliminación
    console.log(`Usuario creado para eliminar: ${JSON.stringify(usuario)}`);
    
    const response = await request(app)
      .put(`/api/usuarios/eliminar/${usuario._id}`)
      .send({ estado: false });

    // Log de solicitud y respuesta
    console.log(`Solicitud enviada: PUT /api/usuarios/eliminar/${usuario._id} - ${JSON.stringify({ estado: false })}`);
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Estado del usuario actualizado');
    expect(response.body).toHaveProperty('usuario');
    expect(response.body.usuario).toHaveProperty('estado', false);
  });

  test('No debe permitir crear un usuario sin correo', async () => {
    const usuarioData = {
      nombre: 'Ana',
      apellido: 'Gómez',
      rol: 'Cajero',
      direccion: '456 Otra Calle',
      telefono: 75969491,
      password: 'otraContraseña123'
    };

    // Log de datos de entrada
    console.log(`Solicitud enviada para crear usuario sin correo: POST /api/usuarios/crear - ${JSON.stringify(usuarioData)}`);
    
    const response = await request(app)
      .post('/api/usuarios/crear')
      .send(usuarioData);

    // Log de respuesta
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'Faltan datos requeridos: nombre, apellido, rol, correo, o password');
  });

  test('Debe manejar errores de base de datos', async () => {
    // Simula un error en la base de datos (puedes hacerlo con un mock o simulación)
    jest.spyOn(Usuario, 'find').mockImplementationOnce(() => {
      throw new Error('Error en la base de datos');
    });

    // Log de solicitud para manejar error de base de datos
    console.log('Solicitud enviada: GET /api/usuarios/mostrar');
    
    const response = await request(app).get('/api/usuarios/mostrar');
    
    // Log de respuesta
    console.log(`Respuesta recibida: ${JSON.stringify(response.body)}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('mensaje', 'Error en la base de datos');
  });
});
