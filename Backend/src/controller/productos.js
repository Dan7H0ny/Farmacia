const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');

// Crear un producto
router.post('/crear',verificacion, async (req, res) => {
  
  const { nombre, descripcion, id_categoria, id_tipo, id_proveedor, cantidad, capacidad, capacidad_pres, precio, usuario, 
    fecha_caducidad } = req.body;
  try {
    
    const fechaActual = new Date(); // Obtén la fecha actual
    const fechaCaducidad = new Date(fecha_caducidad); // Convierte la fecha de caducidad a un objeto Date
    
    // Calcula la fecha mínima de caducidad (un mes a partir de la fecha actual)
    const fechaMinimaCaducidad = new Date(fechaActual);
    fechaMinimaCaducidad.setMonth(fechaMinimaCaducidad.getMonth() + 1);

    // Verifica si la fecha de caducidad es anterior a la fecha mínima de caducidad
    if (fechaCaducidad <= fechaMinimaCaducidad) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser al menos un mes posterior al día de hoy.' });
    }
    const producto= new Producto({ nombre, descripcion, categoria:id_categoria, tipo: id_tipo, proveedor: id_proveedor, cantidad, capacidad, capacidad_pres, 
      precio, usuario, estado: true, fecha_caducidad, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await producto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el Producto' });
  }
});

// Obtener todos los productos
router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const productosEncontrados = await Producto.find({})
      .populate('categoria', 'nombre')
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombreTipo')
      .populate('usuario', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los Productos' });
  }
});

// buscar un producto
router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    
    const producto = await Producto.findById(id)
      .populate('categoria', 'nombre')
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombreTipo')
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

// actualizar un producto
router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, tipo, proveedor, cantidad, capacidad, capacidad_pres, 
    precio, fecha_caducidad  } = req.body;
  try {
    const fechaActual = new Date(); // Obtén la fecha actual
    const fechaCaducidad = new Date(fecha_caducidad); // Convierte la fecha de caducidad a un objeto Date

    // Verifica si la fecha de caducidad es anterior a la fecha actual
    if (fechaCaducidad <= fechaActual) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser posterior al día de hoy.' });
    }
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, descripcion, categoria, tipo, proveedor, cantidad, capacidad, capacidad_pres, 
      precio, fecha_caducidad, fecha_actualizacion: fechaActual  }, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const productosEncontrados = await Producto.find({})
    .populate('categoria', 'nombre')
    .populate('proveedor', 'nombre_marca')
    .populate('tipo', 'nombreTipo')
    .populate('usuario', 'nombre apellido rol correo')
    .sort({ fecha_caducidad: 1 });
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', productosEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Producto' });
  }
});


// Eliminar un producto
router.put('/eliminar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const usuario = await Producto.findByIdAndUpdate(id, { estado });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado exitosamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

module.exports= router