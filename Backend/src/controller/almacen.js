const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');

router.post('/crear',verificacion, async (req, res) => {
  
  const { producto, categoria, precioVenta, cantidad_stock, estado, fecha_caducidad, usuario_registro, usuario_actualizacion, fecha_registro, fecha_actualizacion } = req.body;
  try {
    const fechaActual = new Date(); 
    const fechaCaducidad = new Date(fecha_caducidad);

    const fechaMinimaCaducidad = new Date(fechaActual);
    fechaMinimaCaducidad.setMonth(fechaMinimaCaducidad.getMonth() + 1);

    if (fechaCaducidad <= fechaMinimaCaducidad) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser al menos un mes posterior al día de hoy.' });
    }

    const producto_ = await Producto.findById(producto);
    if (!producto_) return res.status(400).json({ mensaje: 'El producto  no existe' }); 

    const almacen = new Almacen({ nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, usuario_actualizacion,
      fecha_caducidad: fechaCaducidad, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await almacen.save();
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
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });
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
      .populate('proveedor', 'nombre_marca')
      .populate('usuario', 'nombre apellido rol correo')
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

router.get('/buscarnombre/:nombre', verificacion, async (req, res) => {
  const { nombre } = req.params;
  try {
    const productos = await Producto.find({ nombre: { $regex: new RegExp(nombre, 'i') } })
    .populate('categoria', 'nombre')
    .populate('proveedor', 'nombre_marca')
    .populate('tipo', 'nombreTipo')
    .populate('usuario', 'nombre apellido rol correo').sort({ fecha_caducidad: 1 });
    if (!productos || productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_unidad, capacidad_presentacion, usuario_registro, usuario_actualizacion, fecha_caducidad} = req.body;
  try {
    const fechaActual = new Date(); 
    const fechaCaducidad = new Date(fecha_caducidad); 
    const fechaMinimaCaducidad = new Date(fechaActual);
    fechaMinimaCaducidad.setMonth(fechaMinimaCaducidad.getMonth() + 1);

    if (fechaCaducidad <= fechaMinimaCaducidad) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser posterior al día de hoy.' });
    }
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_unidad, capacidad_presentacion, 
      usuario_registro, usuario_actualizacion, fecha_caducidad: fechaCaducidad, fecha_actualizacion: fechaActual  }, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const productosEncontrados = await Producto.find({})
    .populate('proveedor', 'nombre_marca')
    .populate('usuario', 'nombre apellido rol correo')
    .sort({ fecha_caducidad: 1 });
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', productosEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Producto' });
  }
});

module.exports= router