const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');
const Prediccion = require('../models/Prediccion');
const Almacen = require('../models/Almacen');

router.post('/crear',verificacion, async (req, res) => {
  
  const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, usuario_actualizacion } = req.body;
  try {
    const fechaActual = new Date(); 

    const producto= new Producto({ nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, 
      usuario_actualizacion, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await producto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el Producto' });
  }
});

router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const productosEncontrados = await Producto.find({})
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los Productos' });
  }
});

router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id)
      .populate('proveedor', 'nombre_marca correo telefono sitioweb')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el Producto' });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_actualizacion} = req.body;
  try {
    const fechaActual = new Date(); 
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, tipo, descripcion, proveedor, precioCompra, 
      capacidad_presentacion, usuario_actualizacion, fecha_actualizacion: fechaActual  }, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const productosEncontrados = await Producto.find({})
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', productosEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Producto' });
  }
});

router.get('/buscar/por-proveedor/:id', verificacion, async (req, res) => {
  const { id } = req.params; // ID del proveedor

  try {
    // Buscar productos que correspondan al proveedor
    const productos = await Producto.find({ proveedor: id })
      .populate('proveedor', 'nombre_marca correo telefono sitioweb')
      .populate('tipo', 'nombre');
    // Verificar si se encontraron productos
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos para este proveedor' });
    }

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
});

// const productoEncontrado = await Almacen.findOne({ producto: id });
// const prediccion = await Prediccion.findOne({productos: productoEncontrado._id});
// const totalVentas = prediccion ? prediccion.prediccion.ventas.reduce((acc, venta) => acc + venta, 0) : 0;
// const total = Math.max(totalVentas - productoEncontrado.cantidad_stock, 0);
// const producto = await Producto.findById(id)
//   .populate('proveedor', 'nombre_marca correo telefono sitioweb')
//   .populate('tipo', 'nombre')
//   .populate('usuario_registro', 'nombre apellido rol correo')
//   .populate('usuario_actualizacion', 'nombre apellido rol correo')
//   .sort({ fecha_caducidad: 1 });
// const capacidadPresentacion = producto.capacidad_presentacion;
// const cantidadEstimada = capacidadPresentacion ? Math.ceil(total / capacidadPresentacion) : 0;
// const precioEstimado =(cantidadEstimada * producto.precioCompra).toFixed(2);

module.exports= router