const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const verificacion = require('../middlewares/verificacion');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

// Crear un Venta
router.post('/crear', verificacion, async (req, res) => {
  const { cliente, productos, precio_total, usuario_registra, usuario_update } = req.body;
  try {
    const cliente_ = await Cliente.findById(cliente);
    const usuario_registro_ = await Usuario.findById(usuario_registra);
    const usuario_update_ = await Usuario.findById(usuario_update);
    if (!productos || productos.length === 0) { return res.status(400).json({ mensaje: 'La lista de productos está vacía' });}
    if (!cliente_) return res.status(400).json({ mensaje: 'El cliente no existe' });
    if (!usuario_registro_) return res.status(400).json({ mensaje: 'El usuario que registra no existe' });
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
        console.log(productoData)
        // Recorremos cada producto y actualizamos su cantidad
        await productoData.save();
      } else {
        console.log(`El producto ${producto.producto} no se encontró en la base de datos`);
      }
    }
    console.log(productosConPrecio)

    const venta = new Venta({
      cliente,
      productos: productosConPrecio,
      precio_total,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      usuario_registra,
      usuario_update,
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
    const Ventas = await Venta.find({})
    .populate('cliente')
    .populate({
      path: 'productos.producto',
      model: 'Producto',
      populate: {
        path: 'proveedor',
        model: 'Proveedor'
      }
    })
    .populate('usuario_registra')
    .populate('usuario_update');
    res.json(Ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener Ventaes' });
  }
});

// buscar el Venta
router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findById(id)
    .populate('cliente')
    .populate({
      path: 'productos.producto',
      model: 'Producto',
      populate: {
        path: 'proveedor',
        model: 'Proveedor'
      }
    })
    .populate('usuario_registra')
    .populate('usuario_update');
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrado' });
    }
    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el Venta' });
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
