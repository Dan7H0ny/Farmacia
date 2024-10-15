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
    // Encuentra los productos del proveedor
    const productosEncontrados = await Producto.find({ proveedor: id })
      .populate('proveedor', 'nombre_marca')
      .populate('tipo', 'nombre')
      .populate('usuario_registro', 'nombre apellido rol correo')
      .populate('usuario_actualizacion', 'nombre apellido rol correo')
      .sort({ fecha_registro: -1 });

    // Verifica si se encontraron productos
    if (!productosEncontrados.length) {
      return res.status(404).json({ mensaje: 'No se encontraron productos para este proveedor' });
    }

    // Encuentra almacenes relacionados con los productos encontrados
    const idsProductos = productosEncontrados.map(prod => prod._id);
    const almacenes = await Almacen.find({ producto: { $in: idsProductos } });

    // Extraer los IDs de los productos que están en el almacén
    const idsProductosEnAlmacen = almacenes.map(almacen => almacen.producto.toString());

    // Filtrar los productos encontrados para incluir solo aquellos que están en el almacén
    const productosFiltrados = productosEncontrados.filter(producto => 
      idsProductosEnAlmacen.includes(producto._id.toString())
    );

    // Si no se encuentran productos en el almacén
    if (!productosFiltrados.length) {
      return res.status(404).json({ mensaje: 'No hay productos en el almacén para este proveedor' });
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    // Encuentra las predicciones relacionadas
    const predicciones = await Prediccion.find({ productos: { $in: almacenes.map(a => a._id) }, fecha: {$gte:hoy, $lt:mañana} })
      .populate({
        path: 'productos',
        populate: {
          path: 'producto',
          model: 'Producto',
        },
      });

    // Crear una lista de productos con la cantidad estimada
    const productosConCantidadEstimada = productosFiltrados.map(producto => {
      // Buscar la predicción correspondiente para este producto
      const prediccion = predicciones.find(p => p.productos && p.productos.producto._id.toString() === producto._id.toString());

      // Si hay predicción, calcular totalVentas, capacidadPresentacion y cantidadEstimada
      let totalVentas = 0;
      let cantidadEstimada = 1;

      if (prediccion) {
        totalVentas = prediccion.prediccion.ventas ? prediccion.prediccion.ventas.reduce((sum, venta) => sum + venta, 0) : 0;
        const capacidadPresentacion = producto.capacidad_presentacion;
        const total = Math.max(totalVentas - capacidadPresentacion, 0);
        cantidadEstimada = capacidadPresentacion ? Math.max(Math.ceil(total / capacidadPresentacion), 1) : 1;
      }

      // Devolver el producto con el nuevo campo cantidadEstimada
      return {
        ...producto._doc,
        cantidadEstimada,
      };
    });

    // Enviar respuesta con productos con cantidad estimada
    res.json(productosConCantidadEstimada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos y calcular cantidad estimada', error });
  }
});


module.exports= router;