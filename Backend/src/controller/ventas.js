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
        cantidad: item.cantidad,
        precio: item.precio,
      };
    });

    // Recorremos cada producto y actualizamos su cantidad
    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      if (productoData) {
        let factorMultiplicador;

        switch (productoData.categoria) {
          case 'Tabletas':
            factorMultiplicador = 250;
            break;
          case 'Jarabe':
            factorMultiplicador = 1;
            break;
          case 'Sueros':
            factorMultiplicador = 6;
            break;
          case 'Dentifricos':
            factorMultiplicador = 9;
            break;
          case 'Supositorios':
            factorMultiplicador = 12;
            break;
          case 'Suplementos':
            factorMultiplicador = 5;
            break;
          default:
            factorMultiplicador = 1;
        }

        let capacidadRestante = productoData.capacidad_unitaria;
        let cajasRestantes = productoData.capacidad_caja;

        if (capacidadRestante < producto.cantidad) {
          const unidadesExcedentes = producto.cantidad - capacidadRestante;
          cajasRestantes -= Math.ceil(unidadesExcedentes / factorMultiplicador);
          capacidadRestante = factorMultiplicador - (unidadesExcedentes % factorMultiplicador);
        } else {
          capacidadRestante -= producto.cantidad;
        }

        productoData.capacidad_unitaria = capacidadRestante;
        productoData.capacidad_caja = cajasRestantes;

        await productoData.save();
      } else {
        console.log(`El producto ${producto.producto} no se encontró en la base de datos`);
      }
    }

 
    const venta = new Venta({
      cliente,
      productos: productosConPrecio,
      precio_total,
      fecha_emision: new Date(),
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
      return res.status(400).json({ mensaje: `Algunos productos no existen: ${missingIds.join(', ')}` });
    }

    const productosConPrecio = productos.map(item => {
      const productoData = productosData.find(prod => prod._id.equals(item.producto));
      return {
        producto: productoData._id,
        cantidad: item.cantidad,
        precio: item.precio,
      };
    });

    // Recorremos cada producto y actualizamos su cantidad
    for (const producto of productosConPrecio) {
      const productoData = productosData.find(prod => prod._id.equals(producto.producto));
      if (productoData) {
        let factorMultiplicador;

        switch (productoData.categoria) {
          case 'Tabletas':
            factorMultiplicador = 250;
            break;
          case 'Jarabe':
            factorMultiplicador = 1;
            break;
          case 'Sueros':
            factorMultiplicador = 6;
            break;
          case 'Dentifricos':
            factorMultiplicador = 9;
            break;
          case 'Supositorios':
            factorMultiplicador = 12;
            break;
          case 'Suplementos':
            factorMultiplicador = 5;
            break;
          default:
            factorMultiplicador = 1;
        }

        let capacidadRestante = productoData.capacidad_unitaria;
        let cajasRestantes = productoData.capacidad_caja;

        if (capacidadRestante < producto.cantidad) {
          const unidadesExcedentes = producto.cantidad - capacidadRestante;
          cajasRestantes -= Math.ceil(unidadesExcedentes / factorMultiplicador);
          capacidadRestante = factorMultiplicador - (unidadesExcedentes % factorMultiplicador);
        } else {
          capacidadRestante -= producto.cantidad;
        }

        productoData.capacidad_unitaria = capacidadRestante;
        productoData.capacidad_caja = cajasRestantes;

        await productoData.save();
      } else {
        console.log(`El producto ${producto.producto} no se encontró en la base de datos`);
      }
    }

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
  
// Eliminar un Venta
router.delete('/eliminar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  try {
    console.log(rol)
    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'No tiene permisos para eliminar las ventas' });
    }
    const Ventaeliminado = await Venta.findByIdAndDelete(id);
    if (!Ventaeliminado) {
      return res.status(404).json({ mensaje: 'Venta no encontrado' });
    }
    res.json({ mensaje: 'Venta eliminado exitosamente', Ventaeliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar Venta' });
  }
});

module.exports = router;
