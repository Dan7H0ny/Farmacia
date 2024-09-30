const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Producto = require('../models/Producto');
const Prediccion = require('../models/Prediccion');
const Almacen = require('../models/Almacen');

router.post('/crear',verificacion, async (req, res) => {
  
  const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, usuario_actualizacion } = req.body;
  try {
    const fechaActual = new Date(); 

    const producto= new Producto({ nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, 
      usuario_actualizacion, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await producto.save();
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
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });
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
      .populate('proveedor', 'nombre_marca correo telefono sitioweb')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
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

router.put('/actualizar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_actualizacion} = req.body;
  try {
    const fechaActual = new Date(); 
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, tipo, descripcion, proveedor, precioCompra, 
      capacidad_presentacion, usuario_actualizacion, fecha_actualizacion: fechaActual  }, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const productosEncontrados = await Producto.find({})
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', productosEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Producto' });
  }
});

router.get('/mostrar/por-proveedor/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const productosEncontrados = await Producto.find({proveedor: id})
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });
      
    res.json(productosEncontrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los Productos' });
  }
});

router.post('/buscar/predicciones', verificacion, async (req, res) => {
  const { productos } = req.body;
  const idsProductos = productos.map(producto => producto._id);

  try {
    const almacenes = await Almacen.find({ producto: { $in: idsProductos } });
    const idsAlmacen = almacenes.map(almacen => almacen._id);

    const predicciones = await Prediccion.find({ productos: { $in: idsAlmacen } })
      .populate({
        path: 'productos', 
        populate: {
          path: 'producto', 
          model: 'Producto',
        }
      });

    const productosEncontrados = await Producto.find({ _id: { $in: idsProductos } });
    
    const prediccionesConDetalles = predicciones.map(p => {
      const totalVentas = p.prediccion.ventas ? p.prediccion.ventas.reduce((sum, venta) => sum + venta, 0) : 0;

      // Verificar si p.productos es válido
      if (!p.productos) {
        console.log('No hay productos para esta predicción:', p);
        return { ...p._doc, totalVentas, productosDetalles: [] }; // Devolver sin detalles de productos si no hay productos
      }

      // Acceder al producto relacionado a través de Almacen
      const productoCorrespondiente = p.productos.producto; // Cambiar a singular

      if (!productoCorrespondiente) {
        console.log('Producto correspondiente es null o indefinido');
        return { producto: null, total: 0, capacidadPresentacion: 0, cantidadEstimada: 0 };
      }

      // Buscar el producto en la lista de productos encontrados por ID
      const productoEncontrado = productosEncontrados.find(prod => prod._id.toString() === productoCorrespondiente._id.toString());

      // Calcular el total menos la capacidad de presentación del producto
      const capacidadPresentacion = productoEncontrado ? productoEncontrado.capacidad_presentacion : 0;
      const total = productoEncontrado ? Math.max(totalVentas - productoEncontrado.capacidad_presentacion, 0) : 0;
      const cantidadEstimada = capacidadPresentacion ? Math.ceil(total / capacidadPresentacion) : 0;

      // Devolver los detalles del producto
      const productosDetalles = {
        producto: productoCorrespondiente,
        total, // Total calculado
        capacidadPresentacion, // Capacidad de presentación
        cantidadEstimada // Cantidad estimada calculada
      };

      // Devolver la predicción con el detalle del producto
      return {
        ...p._doc,
        totalVentas,
        productosDetalles // Agregar detalles del producto
      };
    });
    res.json(prediccionesConDetalles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las predicciones de los productos', error });
  }
});

// const productoEncontrado = await Almacen.findOne({ producto: id });
// const prediccion = await Prediccion.findOne({productos: productoEncontrado._id});
// const totalVentas = prediccion ? prediccion.prediccion.ventas.reduce((acc, venta) => acc + venta, 0) : 0;
// const total = Math.max(totalVentas - productoEncontrado.cantidad_stock, 0);
// const producto = await Producto.findById(id)
//   .populate('proveedor', 'nombre_marca correo telefono sitioweb')
//   .populate('tipo', 'nombre')
//   .populate('usuario_registro', 'nombre apellido rol correo')
//   .populate('usuario_actualizacion', 'nombre apellido rol correo')
//   .sort({ fecha_caducidad: 1 });
// const capacidadPresentacion = producto.capacidad_presentacion;
// const cantidadEstimada = capacidadPresentacion ? Math.ceil(total / capacidadPresentacion) : 0;
// const precioEstimado =(cantidadEstimada * producto.precioCompra).toFixed(2);

module.exports= router