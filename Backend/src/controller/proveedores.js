const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');
const verificacion = require('../middlewares/verificacion');

// Crear un Proveedor
router.post('/crear',verificacion, async (req, res) => {
  const { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = req.body;
  try {
    const proveedorExistente = await Proveedor.findOne({ nombre_marca });

    if (proveedorExistente) {
      return res.status(400).json({ mensaje: 'Esta marca ya ha sido registrada' });
    }
    const fechaActual = new Date();
    const newproveedor = new Proveedor({ nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular, fecha_registro: fechaActual, fecha_actualizacion: fechaActual });
    await newproveedor.save();
    res.json({ mensaje: 'Proveedor creado exitosamente ', newproveedor }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el Proveedor' });
  }
});

// Obtener todos los Proveedors
router.get('/mostrar',verificacion, async (req, res) => {
  try {
    const Proveedores = await Proveedor.find({}).sort({ fecha_registro: -1 });
    res.json(Proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener Proveedores' });
  }
});

// buscar el Proveedor
router.get('/buscar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el Proveedor' });
  }
});
  
router.put('/actualizar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  let { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = req.body;
  try {
    const proveedorExistente = await Proveedor.findById(id);
    if (!proveedorExistente) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    if (nombre_marca.toLowerCase() !== proveedorExistente.nombre_marca.toLowerCase()) {
      const marcaDuplicada = await Proveedor.findOne({ nombre_marca: { $regex: new RegExp(`^${nombre_marca}$`, 'i') } });
      if (marcaDuplicada) {
        return res.status(400).json({ mensaje: 'La marca ya esta registrado, ingrese otra marca' });
      }
    }

    const fechaActual = new Date();
    let updateFields = { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor,celular, fecha_actualizacion: fechaActual };

    const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, updateFields, { new: true });
    if (!proveedorActualizado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json({ mensaje: 'Proveedor actualizado exitosamente', proveedorActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Proveedor' });
  }
});


module.exports = router;
