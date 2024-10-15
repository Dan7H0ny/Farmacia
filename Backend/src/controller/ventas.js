const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const verificacion = require('../middlewares/verificacion');
const Cliente = require('../models/Cliente');
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
        nombre: item.nombre,
        tipo: item.tipo,
        proveedor: item.proveedor,
        categoria: item.categoria,
        estado: item.estado,
        cantidad_producto: item.cantidad_producto,
        precio_venta: item.precio_venta,
      };
    });

    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      if (productoData) {
        const capacidadRestante = productoData.cantidad_stock - producto.cantidad_producto;
        productoData.cantidad_stock = capacidadRestante;
        if (productoData.cantidad_stock <= 0) {
          productoData.estado = false;
        }
        else if(productoData.cantidad_stock > 0){
          productoData.estado = true;
        }
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
    console.log(error);
    res.status(500).json({ mensaje: 'Error al crear la venta', error: error.mensaje });
  }
});

// Obtener todos los Ventas
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const ventas = await Venta.find({})
    .populate({
      path: 'cliente',
      populate: {
        path: 'stringIdentity',
        model: 'Complemento'  // Asegúrate de que 'Complemento' es el modelo correcto.
      }
    })
    .populate('usuario_registra') // Opcional, si necesitas datos de usuario
    .populate('usuario_update')
    .sort({ fecha_registro: -1 });
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
          path: 'stringIdentity',
          model: 'Complemento'  // Asegúrate de que 'Complemento' es el modelo correcto.
        }
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
router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { cliente, productos, precio_total, usuario } = req.body;

  try {
    if (!cliente) return res.status(400).json({ mensaje: 'Seleccione a un cliente' });
    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'La lista de productos está vacía, añada productos' });
    }
    
    const ventaActual = await Venta.findById(id).populate('productos.producto');
    if (!ventaActual) return res.status(404).json({ mensaje: 'Venta no encontrada' });

    const productosIds = productos.map(item => item.producto);
    const productosData = await Almacen.find({ _id: { $in: productosIds } });

    const productosConPrecio = productos.map(item => {
      const productoData = productosData.find(prod => prod._id.equals(item.producto));
      return {
        producto: productoData._id,
        nombre: item.nombre,
        tipo: item.tipo,
        proveedor: item.proveedor,
        categoria: item.categoria,
        estado: item.estado,
        cantidad_producto: item.cantidad_producto,
        precio_venta: item.precio_venta,
      };
    });

    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      const productoVentaActual = ventaActual.productos.find(p => p.producto.equals(producto.producto));
      const cantidadOriginal = productoVentaActual ? productoVentaActual.cantidad_producto : 0;
      const cantidadNueva = producto.cantidad_producto;
      const diferenciaCantidad = cantidadOriginal - cantidadNueva;

      if (productoData && diferenciaCantidad !== 0) {
        productoData.cantidad_stock += diferenciaCantidad;
      }
      if (productoData.cantidad_stock <= 0) {
        productoData.estado = false;
      }
      else if(productoData.cantidad_stock > 0){
        productoData.estado = true;
      }
      await productoData.save();
    }

    const ventaActualizada = await Venta.findByIdAndUpdate(
      id,
      {
        cliente: cliente._id,
        productos: productosConPrecio,
        precio_total,
        fecha_actualizacion: new Date(),
        usuario_update: usuario
      }, 
      { new: true }
    );

    if (!ventaActualizada) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    res.json({ mensaje: 'Venta actualizada exitosamente', ventaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la venta' });
  }
});


module.exports = router;
