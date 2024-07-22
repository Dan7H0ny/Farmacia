const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const verificacion = require('../middlewares/verificacion');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');

// Crear un Venta
router.post('/crear', verificacion, async (req, res) => {
  const { cliente, productos, precio_total, usuario } = req.body;
  try {
    if (!cliente) return res.status(400).json({ mensaje: 'Seleccione a un cliente' });
    const cliente_ = await Cliente.findById(cliente._id);
    if (!productos || productos.length === 0) { return res.status(400).json({ mensaje: 'La lista de productos está vacía, añada productos' });}
    if (!cliente_) return res.status(400).json({ mensaje: 'El cliente no existe' });

    const productosIds = productos.map(item => item.producto);
    const productosData = await Almacen.find({ _id: { $in: productosIds } });

    if (productosData.length !== productos.length) {
      const missingIds = productosIds.filter(id => !productosData.some(prod => prod._id.equals(id)));
      return res.status(400).json({ mensaje: `Algunos productos no existen si no se soluciona reinicie la pagina: ${missingIds.join(', ')}` });
    }
    const productosConPrecio = productos.map(item => {
      const productoData = productosData.find(prod => prod._id.equals(item.producto));
      return {
        producto: productoData._id,
        cantidad_producto: item.cantidad_producto,
      };
    });

    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      if (productoData) {
        const capacidadRestante = productoData.cantidad_stock - producto.cantidad_producto;
        productoData.cantidad_stock = capacidadRestante;
        await productoData.save();
      } else {
        console.log(`El producto ${producto.producto} no se encontró en la base de datos`);
      }
    }
    const venta = new Venta({
      cliente: cliente._id,
      productos: productosConPrecio,
      precio_total,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registra: usuario,
      usuario_update: usuario,
    });

    await venta.save();
    res.json({ mensaje: 'Venta creada exitosamente', venta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la venta', error: error.message });
  }
});

// Obtener todos los Ventas
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const ventas = await Venta.find({})
      .populate('cliente') // Poblamos el cliente
      .populate({
        path: 'productos.producto',
        populate: {
          path: 'producto', // Referencia al esquema Producto en Almacen
          model: 'Producto',
          populate: {
            path: 'proveedor', // Referencia al proveedor en Producto
            model: 'Proveedor',
            select: 'nombre_marca' // Solo seleccionamos el campo nombre_marca del proveedor
          },
          select: 'nombre' // Solo seleccionamos el campo nombre del producto
        },
        select: 'precioVenta' // Solo seleccionamos el campo precioVenta del almacen
      })
      .populate('usuario_registra') // Opcional, si necesitas datos de usuario
      .populate('usuario_update'); // Opcional, si necesitas datos de usuario

    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener Ventas' });
  }
});

// buscar el Venta
router.get('/buscar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findById(id)
    .populate({
      path: 'cliente',
      populate: {
        path: 'stringIdentity', // Campo que hace referencia a Complemento
        select: 'nombre' // Campo específico de Complemento que deseas incluir
      }
    })
    .populate({
      path: 'productos.producto',
      populate: {
        path: 'producto', // Referencia al esquema Producto en Almacen
        model: 'Producto',
        populate: {
          path: 'proveedor', // Referencia al proveedor en Producto
          model: 'Proveedor',
          select: 'nombre_marca' // Solo seleccionamos el campo nombre_marca del proveedor
        },
        select: 'nombre' // Solo seleccionamos el campo nombre del producto
      },
      select: 'precioVenta' // Solo seleccionamos el campo precioVenta del almacen
    })
    .populate('usuario_registra') // Opcional, si necesitas datos de usuario
    .populate('usuario_update'); // Opcional, si necesitas datos de usuario
    
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la venta' });
  }
});
  
// Actualizar un Venta
router.put('/actualizar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { cliente, productos, precio_total, usuario_update} = req.body;
  try {
    const cliente_ = await Cliente.findById(cliente);
    const usuario_update_ = await Usuario.findById(usuario_update);
    if (!productos || productos.length === 0) { return res.status(400).json({ mensaje: 'La lista de productos está vacía' });}
    if (!cliente_) return res.status(400).json({ mensaje: 'El cliente no existe' });

    if (!usuario_update_) return res.status(400).json({ mensaje: 'El usuario que actualiza no existe' });

    const productosIds = productos.map(item => item.producto);
    const productosData = await Producto.find({ _id: { $in: productosIds } });

    if (productosData.length !== productos.length) {
      const missingIds = productosIds.filter(id => !productosData.some(prod => prod._id.equals(id)));
      return res.status(400).json({ mensaje: `Algunos productos no existen si no se soluciona reinicie la pagina: ${missingIds.join(', ')}` });
    }
    const productosConPrecio = productos.map(item => {
      const productoData = productosData.find(prod => prod._id.equals(item.producto));
      return {
        producto: productoData._id,
        cantidad_producto: item.cantidad_producto,
        precio_producto: item.precio_producto,
      };
    });
    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      if (productoData) {
        const factorMultiplicador = productoData.categoria.cantidad;
        let capacidadRestante = productoData.capacidad;
        let cajasRestantes = productoData.capacidad_pres;
    
        if (capacidadRestante < producto.cantidad_producto) {
          const unidadesExcedentes = producto.cantidad_producto - capacidadRestante;
          cajasRestantes -= Math.ceil(unidadesExcedentes / factorMultiplicador);
          capacidadRestante = factorMultiplicador - (unidadesExcedentes % factorMultiplicador);
        } else {
          capacidadRestante -= producto.cantidad_producto;
        }
    
        productoData.capacidad = capacidadRestante;
        productoData.capacidad_pres = cajasRestantes;
  
        // Recorremos cada producto y actualizamos su cantidad
        await productoData.save();
      } else {
        console.log(`El producto ${producto.producto} no se encontró en la base de datos`);
      }
    }
    console.log(productosConPrecio)
    const VentaActualizado = await Venta.findByIdAndUpdate(
      id,
      { 
        cliente,
        productos: productosConPrecio,
        precio_total,
        fecha_actualizacion: new Date(),
        usuario_update,
      }, 
      { new: true }
    );
    if (!VentaActualizado) {
      return res.status(404).json({ mensaje: 'Venta no encontrado' });
    }
    res.json({ mensaje: 'Venta actualizada exitosamente', VentaActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Venta' });
  }
});

module.exports = router;
