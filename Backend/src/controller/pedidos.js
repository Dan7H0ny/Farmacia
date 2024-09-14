const Pedido = require('../models/Pedido');
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');
const verificacion = require('../middlewares/verificacion');


// Ruta para crear un pedido
router.post('/crear', verificacion, async (req, res) => {
  const { producto, cantidad, precio } = req.body;
  try {
    const fechaActual = new Date();

    // Verificar si el producto existe en la base de datos
    const productoExistente = await Producto.findById(producto);
    if (!productoExistente) {
      return res.status(400).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar si ya existe un pedido con el mismo producto
    const pedidoExistente = await Pedido.findOne({ producto });
    if (pedidoExistente) {
      return res.status(400).json({ mensaje: 'El pedido para este producto ya existe' });
    }

    // Crear el nuevo pedido si no existe uno previo
    const nuevoPedido = new Pedido({
      producto,
      precio_total: precio,
      estado: 'Pendiente',
      cantidad_total: cantidad,
      fecha_registro: fechaActual
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error });
  }
});


router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ })
    .populate('producto', 'nombre capacidad_presentacion') // Poblar la referencia al producto
    .sort({ fecha_registro: 1 }); // Ordenar por fecha de registro ascendente

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error });
  }
});

router.get('/buscar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await Pedido.findById(id)
    .populate('producto', 'nombre capacidad_presentacion') // Poblar la referencia al producto
    .sort({ fecha_registro: 1 });
    
    if (!pedidos) {
      return res.status(404).json({ mensaje: 'pedido no encontrado' });
    }
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
});


router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { producto, cantidad, estado } = req.body;
  try {

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    if (pedido.estado === estado){
      return res.status(404).json({ mensaje: 'El estado es el mismo'});
    }
    if(estado === 'Aceptado'){
      if (producto) {
        const productoEnAlmacen = await Almacen.findOne({ producto });
        if (!productoEnAlmacen) {
          return res.status(400).json({ mensaje: 'Producto no encontrado' });
        }
        if (productoEnAlmacen) {
          pedido.estado = 'Aceptado';
          const nuevaCantidad = productoEnAlmacen.cantidad_stock + cantidad;
          await Almacen.findByIdAndUpdate(productoEnAlmacen._id, { cantidad_stock: nuevaCantidad });
        }
      }
    }
    else if(estado === 'Rechazado'){
      if (producto) {
        const productoEnAlmacen = await Almacen.findOne({ producto });
        if (!productoEnAlmacen) {
          return res.status(400).json({ mensaje: 'Producto no encontrado' });
        }
        if (productoEnAlmacen) {
          pedido.estado = 'Rechazado';
          const nuevaCantidad = productoEnAlmacen.cantidad_stock - cantidad;
          await Almacen.findByIdAndUpdate(productoEnAlmacen._id, { cantidad_stock: nuevaCantidad });
        }
      }
    }
    else if(estado === 'Pendiente'){
      if (producto) {
        const productoEnAlmacen = await Almacen.findOne({ producto });
        if (!productoEnAlmacen) {
          return res.status(400).json({ mensaje: 'Producto no encontrado' });
        }
        if (productoEnAlmacen) {
          pedido.estado = 'Aceptado';
          const nuevaCantidad = productoEnAlmacen.cantidad_stock + cantidad;
          await Almacen.findByIdAndUpdate(productoEnAlmacen._id, { cantidad_stock: nuevaCantidad });
        }
      }
    }
    await pedido.save();

    res.status(200).json({ mensaje: 'Pedido actualizado'});
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error });
  }
});

router.delete('/eliminar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar el pedido
    await Pedido.findByIdAndDelete(id)
    res.status(200).json({ mensaje: 'Pedido Rechazado'});
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error });
  }
});


module.exports= router;