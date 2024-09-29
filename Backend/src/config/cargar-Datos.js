const mongoose = require('mongoose');
const Proveedor = require('../models/Proveedor');
const Complemento = require('../models/Complemento');
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Venta = require('../models/Venta');

// Complementos
const nombresComplementos = [
    'Tipo', 'Categoría', 'Identificación'
];

const crearComplementos = async function() {
    const complementos = nombresComplementos.map(nombre => ({ nombreComplemento: nombre }));
    await Complemento.insertMany(complementos);
};

// Proveedores
const generarProveedor = async function() {
    const proveedores = await Proveedor.find();
    return proveedores.length > 0 ? proveedores[Math.floor(Math.random() * proveedores.length)]._id : null;
};

// Productos
const nombresProducto = [
    'Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E',
    'Producto F', 'Producto G', 'Producto H', 'Producto I', 'Producto J'
];

const generarPrecioCompra = function() {
    const min = 2;
    const max = 100;
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

const crearProductos = async function() {
    const usuarios = await Usuario.find();
    const proveedores = await Proveedor.find();
    const tipos = await Complemento.find({ nombreComplemento: 'Tipo' });

    const productos = await Promise.all(nombresProducto.map(async nombreProducto => {
        const usuario_ = usuarios[Math.floor(Math.random() * usuarios.length)]._id;
        const proveedor_ = proveedores[Math.floor(Math.random() * proveedores.length)]._id;
        const tipo_ = tipos.length ? tipos[Math.floor(Math.random() * tipos.length)]._id : null;

        return new Producto({
            nombre: nombreProducto,
            tipo: tipo_,
            descripcion: '',
            proveedor: proveedor_,
            precioCompra: generarPrecioCompra(),
            capacidad_presentacion: Math.floor(Math.random() * 241) + 10,
            usuario_registro: usuario_,
            usuario_actualizacion: usuario_,
            fecha_registro: new Date(),
            fecha_actualizacion: new Date()
        });
    }));

    await Producto.insertMany(productos);
    console.log('Productos insertados correctamente');
};

// Almacén
const generarCantidadStock = function() {
    return Math.floor(Math.random() * 226) + 25;
};

const cargarAlmacen = async function() {
    const usuarios = await Usuario.find();
    const productos = await Producto.find();

    const almacen = productos.map(producto => {
        return {
            producto: producto._id,
            categoria: null, // Puedes asignar categorías si es necesario
            precioVenta: producto.precioCompra + (Math.random() * 10),
            cantidad_stock: generarCantidadStock(),
            estado: true,
            fecha_caducidad: new Date(new Date().setMonth(new Date().getMonth() + Math.floor(Math.random() * 13) + 3)),
            usuario_registro: usuarios[Math.floor(Math.random() * usuarios.length)]._id,
            usuario_actualizacion: usuarios[Math.floor(Math.random() * usuarios.length)]._id,
            fecha_registro: new Date(),
            fecha_actualizacion: new Date()
        };
    });

    await Almacen.insertMany(almacen);
    console.log('Datos del almacén insertados correctamente');
};

// Clientes
const generarNombreCompleto = function() {
    const nombres = ['Maria', 'Jose', 'Ainara', 'Pablo', 'Ruth'];
    const apellidos = ['Prado', 'Tejada', 'Barba', 'Villar', 'Matas'];
    return `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
};

const crearClientes = async function() {
    const clientes = [];

    for (let i = 0; i < 250; i++) {
        const nombreCompleto = generarNombreCompleto();
        clientes.push({
            nombreCompleto,
            correo: `${nombreCompleto.toLowerCase().replace(/ /g, '.')}@example.com`,
            numberIdentity: Math.floor(Math.random() * 10000000000),
            usuario_registro: await generarUsuario(),
            fecha_registro: new Date(),
            fecha_actualizacion: new Date()
        });
    }

    await Cliente.insertMany(clientes);
    console.log('Clientes insertados correctamente');
};

// Ventas
const generarCantidadProducto = function() {
    return Math.floor(Math.random() * 10) + 1;
};

const cargarVentas = async function() {
    const clientes = await Cliente.find();
    const productos = await Almacen.find().populate('producto');
    const usuarios = await Usuario.find();

    const ventas = [];

    for (let i = 0; i < 3000; i++) {
        const cliente = clientes[Math.floor(Math.random() * clientes.length)]._id;
        const usuarioRegistra = usuarios[Math.floor(Math.random() * usuarios.length)]._id;

        const numProductos = Math.floor(Math.random() * 5) + 1; // Cada venta tiene entre 1 y 5 productos
        const productosVenta = [];
        let precioTotal = 0;

        for (let j = 0; j < numProductos; j++) {
            const producto = productos[Math.floor(Math.random() * productos.length)];
            const cantidadProducto = generarCantidadProducto();
            const precioVenta = producto.precioVenta * cantidadProducto;

            productosVenta.push({
                producto: producto._id,
                cantidad_producto: cantidadProducto,
                precio_venta: precioVenta
            });

            precioTotal += precioVenta;
        }

        ventas.push({
            cliente,
            productos: productosVenta,
            precio_total: precioTotal,
            fecha_registro: new Date(),
            usuario_registra: usuarioRegistra
        });
    }

    await Venta.insertMany(ventas);
    console.log('Datos de ventas insertados correctamente');
};

// Función principal para ejecutar todo
const cargarDatos = async function() {
    await crearComplementos();
    await crearProductos();
    await cargarAlmacen();
    await crearClientes();
    await cargarVentas();
};

// Ejecutar
cargarDatos().catch(console.error);
