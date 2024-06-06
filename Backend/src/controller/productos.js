const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');

// Crear un producto
router.post('/crear',verificacion, async (req, res) => {
  const { nombre, descripcion, categoria, proveedor, capacidad_caja, capacidad_unitaria, precio_por_menor, precio_por_mayor, usuario, 
    fecha_caducidad, fecha_registro, fecha_actualizacion } = req.body;
  try {
    const fechaActual = new Date(); // Obtén la fecha actual
    const fechaCaducidad = new Date(fecha_caducidad); // Convierte la fecha de caducidad a un objeto Date

    // Verifica si la fecha de caducidad es anterior a la fecha actual
    if (fechaCaducidad <= fechaActual) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser posterior al día de hoy.' });
    }
    const producto= new Producto({ nombre, descripcion, categoria, proveedor, capacidad_caja, capacidad_unitaria, precio_por_menor, 
      precio_por_mayor, usuario, fecha_caducidad, fecha_registro, fecha_actualizacion });
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
      .populate('proveedor', 'nombre_marca')
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
    .populate('proveedor', 'nombre_marca')
    .populate('usuario', 'nombre apellido rol correo').sort({ fecha_caducidad: 1 });
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
      .populate('proveedor', 'nombre_marca')
      .populate('usuario', 'nombre apellido rol correo');

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
  const { nombre, descripcion, categoria, proveedor, capacidad_primaria, capacidad_secundaria, capacidad_terciaria, 
    precio_por_menor, precio_por_mayor, usuario, fecha_caducidad, fecha_registro, fecha_actualizacion } = req.body;
  try {
    const fechaActual = new Date(); // Obtén la fecha actual
    const fechaCaducidad = new Date(fecha_caducidad); // Convierte la fecha de caducidad a un objeto Date

    // Verifica si la fecha de caducidad es anterior a la fecha actual
    if (fechaCaducidad <= fechaActual) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser posterior al día de hoy.' });
    }
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, descripcion, categoria, proveedor, 
      capacidad_primaria, capacidad_secundaria, capacidad_terciaria, precio_por_menor, precio_por_mayor, usuario, 
      fecha_caducidad, fecha_registro, fecha_actualizacion }, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', productoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Producto' });
  }
});


// Eliminar un producto
router.delete('/eliminar/:id',verificacion, async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await Producto.findByIdAndDelete(id);
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
      res.json({ mensaje: 'Producto eliminado exitosamente', producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
});

module.exports= router