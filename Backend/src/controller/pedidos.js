const Pedido = require('../models/Pedido');
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Almacen = require('../models/Almacen');
const verificacion = require('../middlewares/verificacion');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const mime = require('mime-types');


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
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 5 MB, ajusta según tus necesidades
});


router.post('/crear', verificacion, upload.single('imagenPrueba'), async (req, res) => {
  const { proveedor, precio_total, usuario } = req.body;
  const productos = JSON.parse(req.body.productos);
  const imagenPrueba = req.file ? req.file.filename : null;
  
  try {
    // Validar que se enviaron productos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'La lista de productos no es válida o está vacía, añada productos' });
    }

    // Crear un nuevo pedido 
    const nuevoPedido = new Pedido({
      proveedor,
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
    const pedidos = await Pedido.find({})
      .populate('productos.producto', 'nombre capacidad_presentacion')
      .sort({ fecha_registro: 1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error });
  }
});

router.get('/buscar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await Pedido.findById(id)
    .populate('productos.producto', 'nombre capacidad_presentacion')
    .populate('usuario_registro', 'nombre apellido rol correo')
    .populate('usuario_actualizacion', 'nombre apellido rol correo')
    .sort({ fecha_registro: 1 });
    res.status(200).json(pedidos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
});

router.get('/descargar/:id/:nombreArchivo', verificacion, async (req, res) => {
  const { id, nombreArchivo } = req.params;
  try {
    const pedido = await Pedido.findById(id);

    // Verifica si el pedido y el archivo existen
    if (!pedido || !pedido[nombreArchivo]) {
      return res.status(404).json({ mensaje: 'Archivo no encontrado' });
    }

    // Ruta del archivo
    const filePath = path.join(__dirname, '../../uploads/', pedido[nombreArchivo]);
    
    // Verifica si el archivo existe en el servidor
    if (fs.existsSync(filePath)) {
      // Determina el tipo de contenido del archivo
      const fileMimeType = mime.lookup(filePath); // Usa 'mime' para obtener el tipo mime
      res.setHeader('Content-Type', fileMimeType); // Establece el encabezado 'Content-Type'
      
      // Descarga el archivo
      res.download(filePath, pedido[nombreArchivo], (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).json({ mensaje: 'Error al descargar el archivo' });
        }
      });
    } else {
      res.status(404).json({ mensaje: 'Archivo no encontrado en el servidor' });
    }
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ mensaje: 'Error al obtener el pedido' });
  }
});



router.put('/actualizar/:id', verificacion, upload.single('imagenVerificado'), async (req, res) => {
  const { id } = req.params;
  const { productos, estado, correo, password } = req.body;
  const imagenVerificado = req.file ? req.file.filename : null;
  try {
    const usuarioEncontrado = await Usuario.findOne({ correo });
    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'Credenciales incorrectas' });
    }

    const match = await bcryptjs.compare(password, usuarioEncontrado.password);
    if (match) {
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      }

      if (pedido.estado !== 'Pendiente') {
        return res.status(404).json({ mensaje: 'Este pedido ya ha sido modificado' });
      }

      const productosSobrantes = []; // Array para acumular los productos sobrantes

      if (estado === 'Confirmado') {
        for (const item of productos) {
          const { producto, cantidad } = item;
          const productoEnAlmacen = await Almacen.findOne({ producto: producto }).populate({
            path: 'producto',
            select: 'nombre capacidad_presentacion',
          });

          if (productoEnAlmacen) {
            const pedidoOriginal = pedido.productos.find(p => p.producto.toString() === producto.toString());
            if (pedidoOriginal) {
              const cantidadDisponible = pedidoOriginal.cantidad_producto;

              if (cantidad < cantidadDisponible) {
                const cantidadRestante = cantidadDisponible - cantidad;
                productosSobrantes.push({
                  producto: pedidoOriginal.producto,
                  nombre: pedidoOriginal.nombre,
                  tipo: pedidoOriginal.tipo,
                  cantidad_producto: cantidadRestante,
                  precioCompra: pedidoOriginal.precioCompra,
                });
              }

              pedidoOriginal.cantidad_producto = cantidad; 
              const precioTotalPorProducto = cantidad * pedidoOriginal.precioCompra;
              
              pedido.precio_total = pedido.precio_total - (cantidadDisponible * pedidoOriginal.precioCompra) + precioTotalPorProducto;
            } 
          } 
        }

        if (productosSobrantes.length > 0) {
          const nuevoPedido = new Pedido({
            proveedor: pedido.proveedor,
            productos: productosSobrantes,
            precio_total: productosSobrantes.reduce((total, item) => total + (item.cantidad_producto * item.precioCompra), 0),
            estado: 'Pendiente',
            imagenPrueba:null,
            imagenVerificado: null,
            usuario_registro: pedido.usuario_registro,
            usuario_actualizacion:usuarioEncontrado,
            fecha_registro: new Date(),
            fecha_actualizacion: new Date(),
          });

          await nuevoPedido.save();
        }

        pedido.estado = 'Confirmado';
      } else if (estado === 'Rechazado') {
        pedido.estado = 'Rechazado';
      }
      if (imagenVerificado) {
        // Si el archivo existe, guarda su nombre en el pedido
        pedido.imagenVerificado = req.file.filename;
      }

      await pedido.save();
      
      const pedidos = await Pedido.find({})
      .populate('productos.producto', 'nombre capacidad_presentacion')
      .sort({ fecha_registro: 1 });

      res.status(200).json({ mensaje: 'Pedido actualizado', pedidos });
    } else {
      return res.status(404).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error });
  }
});

router.delete('/eliminar/:id', verificacion, async (req, res) => {
  const { id } = req.params;
  const { correo, password } = req.body;

  try {
      const usuarioEncontrado = await Usuario.findOne({ correo });
      if (!usuarioEncontrado) {
          return res.status(404).json({ mensaje: 'Credenciales incorrectas' });
      }

      const match = await bcryptjs.compare(password, usuarioEncontrado.password);
      if (match) {
          await Pedido.findByIdAndDelete(id);
          return res.status(200).json({ mensaje: 'Pedido Eliminado' });
      } else {
          return res.status(403).json({ mensaje: 'Contraseña incorrecta' });
      }
  } catch (error) {
      console.error(error); // Agrega log para el error
      res.status(500).json({ mensaje: 'Error al eliminar el pedido', error });
  }
});


module.exports= router;