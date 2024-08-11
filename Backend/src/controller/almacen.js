const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');

router.post('/crear',verificacion, async (req, res) => {
  const { producto, categoria, precioVenta, cantidad_stock, fecha_caducidad, usuario } = req.body;
  try {
    const fechaActual = new Date(); 
    const fechaCaducidad = new Date(fecha_caducidad);

    const fechaMinimaCaducidad = new Date(fechaActual);
    fechaMinimaCaducidad.setMonth(fechaMinimaCaducidad.getMonth() + 1);

    if (fechaCaducidad <= fechaMinimaCaducidad) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser al menos un mes posterior al día de hoy.' });
    }

    const producto_ = await Producto.findById(producto);
    if (!producto_) return res.status(400).json({ mensaje: 'Seleccione un producto existente' });

    const productoEnAlmacen = await Almacen.findOne({ producto });
    if (productoEnAlmacen) {
      return res.status(400).json({ mensaje: 'El producto ya está registrado en el almacén.' });
    }
     
    const almacen = new Almacen({ producto, categoria, precioVenta, cantidad_stock, estado: true, usuario_registro: usuario, usuario_actualizacion: usuario,
      fecha_caducidad: fechaCaducidad, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await almacen.save();
    res.status(201).json({ mensaje: 'Producto Añadido exitosamente', almacen });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al añadir un producto al almacen' });
  }
});

router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const productosEncontrados = await Almacen.find({})
      .populate({
      path: 'producto',
      select: 'nombre capacidad_presentacion precioCompra categoria',
      populate: [
        { path: 'tipo', select: 'nombre' },
        { path: 'proveedor', select: 'nombre_marca' }
      ]
      })
      .populate('categoria', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el producto del almacen' });
  }
});

router.get('/mostrar/pedidos', verificacion, async (req, res) => {
  try {
    const productosEncontrados = await Almacen.find({})
      .populate({
        path: 'producto',
        select: 'nombre capacidad_presentacion precioCompra categoria',
        populate: [
          { path: 'tipo', select: 'nombre' },
          { path: 'proveedor', select: 'nombre_marca correo telefono sitioweb' },
        ]
      })
      .populate('categoria', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el producto del almacen' });
  }
});


router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Almacen.findById(id)
    .populate({
      path: 'producto',
      select: 'nombre capacidad_presentacion precioCompra categoria',
      populate: [
        { path: 'tipo', select: 'nombre' },
        { path: 'proveedor', select: 'nombre_marca' }
      ]
      })
      .populate('categoria', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 }).exec();
    if (!producto) {
      return res.status(404).json({ mensaje: 'Almacen no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el Almacen' });
  }
});
router.get('/buscarproducto/:producto', verificacion, async (req, res) => {
  const { producto } = req.params;
  try {
    const almacen = await Almacen.findOne({ producto })
      .populate({
        path: 'producto',
        select: 'nombre capacidad_presentacion precioCompra categoria',
        populate: [
          { path: 'tipo', select: 'nombre' },
          { path: 'proveedor', select: 'nombre_marca' }
        ]
      })
      .populate('categoria', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 })
      .exec();
    if (!almacen) {
      return res.status(404).json({ mensaje: 'Almacen no encontrado' });
    }
    res.json(almacen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el Almacen' });
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
  const { producto, categoria, precioVenta, cantidad_stock, fecha_caducidad, usuario } = req.body;

  try {
    const fechaActual = new Date();
    const fechaCaducidad = new Date(fecha_caducidad);

    const fechaMinimaCaducidad = new Date(fechaActual);
    fechaMinimaCaducidad.setMonth(fechaMinimaCaducidad.getMonth() + 1);

    if (fechaCaducidad <= fechaMinimaCaducidad) {
      return res.status(400).json({ mensaje: 'La fecha de caducidad debe ser al menos un mes posterior al día de hoy.' });
    }

    // Verificar si el producto existe
    const producto_ = await Producto.findById(producto);
    if (!producto_) {
      return res.status(400).json({ mensaje: 'El producto no existe' });
    }

    // Actualizar el almacen
    const almacenActualizado = await Almacen.findByIdAndUpdate(
      id,
      { 
        producto, 
        categoria, 
        cantidad_stock, 
        precioVenta, 
        usuario_actualizacion: usuario,
        fecha_caducidad: fechaCaducidad,
        fecha_actualizacion: fechaActual 
      },
      { new: true }
    );

    // Actualizar el estado si la cantidad de stock es menor o igual a cero
    if (almacenActualizado.cantidad_stock <= 0) {
      await Almacen.findByIdAndUpdate(
        id, 
        { estado: false },
        { new: true }
      );
    }
    else{
      await Almacen.findByIdAndUpdate(
        id, 
        { estado: true },
        { new: true }
      );
    }

    // Obtener todos los almacenes actualizados
    const almacenesEncontrados = await Almacen.find({})
      .populate('producto', 'nombre')
      .populate('categoria', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_caducidad: 1 });

    res.status(200).json({ mensaje: 'Almacen actualizado exitosamente', almacenesEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el almacen' });
  }
});

module.exports= router