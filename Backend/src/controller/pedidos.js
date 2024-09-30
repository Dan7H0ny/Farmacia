const Pedido = require('../models/Pedido');
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Almacen = require('../models/Almacen');
const verificacion = require('../middlewares/verificacion');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear el directorio uploads si no existe
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Agrega un timestamp para asegurar nombres únicos
        cb(null, file.fieldname + '-' + uniqueSuffix); // Nombre del archivo final
    }
});

// Inicializar Multer con la configuración
const upload = multer({ storage: storage });

router.post('/crear', verificacion, upload.single('imagenPrueba'), async (req, res) => {
  const { precio_total, usuario } = req.body;
  const productos = JSON.parse(req.body.productos);
  const imagenPrueba = req.file ? req.file.filename : null;
  
  try {
    // Validar que se enviaron productos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'La lista de productos no es válida o está vacía, añada productos' });
    }

    // Crear un nuevo pedido 
    const nuevoPedido = new Pedido({
      productos: productos,
      precio_total,
      estado: 'Pendiente',
      usuario_registro: usuario,
      usuario_actualizacion: usuario,
      fecha_registro: new Date(),
      fecha_actualizacion: new Date(),
      imagenPrueba,
      imagenVerificado: null,
    });

    // Guardar el pedido en la base de datos
    await nuevoPedido.save();

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', nuevoPedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
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