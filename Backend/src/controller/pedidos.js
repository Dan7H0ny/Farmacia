const Pedido = require('../models/Pedido');
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');
const verificacion = require('../middlewares/verificacion');

// Crear un cliente
router.post('/crear', verificacion, async (req, res) => {
  const { producto, cantidad } = req.body;
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
      cantidad_total: cantidad,
      fecha_registro: fechaActual
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error });
  }
});


// Obtener todos los clientes
router.get('/mostrar', verificacion, async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('producto', 'nombre capacidad_presentacion') // Poblar la referencia al producto
      .sort({ fecha_registro: -1 }); // Ordenar por fecha de registro descendente

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error });
  }
});

// Obtener un cliente por ID
router.get('/buscar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findById(id)
      .populate('usuario_registro', 'nombre apellido rol')
      .populate('usuario_actualizacion', 'nombre apellido rol')
      .populate('stringIdentity', 'nombre');
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el cliente', error: error.message });
  }
});

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { producto, cantidad } = req.body;
  try {
    // Verificar si el producto existe
    if (producto) {
      const productoEnAlmacen = await Almacen.findOne({ producto });
      if (!productoEnAlmacen) {
        return res.status(400).json({ mensaje: 'Producto no encontrado' });
      }
      if (productoEnAlmacen) {
        const nuevaCantidad = productoEnAlmacen.cantidad_stock + cantidad;
        await Almacen.findByIdAndUpdate(productoEnAlmacen._id, { cantidad_stock: nuevaCantidad });
      }
    }
    // Eliminar el pedido
    await Pedido.findByIdAndDelete(id);
    res.status(200).json({ mensaje: 'Pedido actualizado y eliminado'});
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error });
  }
});

router.delete('/eliminar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar el pedido
    await Pedido.findByIdAndDelete(id);
    res.status(200).json({ mensaje: 'Pedido eliminado Exitosamente'});
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error });
  }
});


module.exports= router;