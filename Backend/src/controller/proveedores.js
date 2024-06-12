const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');
const verificacion = require('../middlewares/verificacion');

// Crear un Proveedor
router.post('/crear',verificacion, async (req, res) => {
  let { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = req.body;
  correo = correo && correo.trim() !== '' ? correo : 's/n';
  correo_vendedor = correo_vendedor && correo_vendedor.trim() !== '' ? correo_vendedor : 's/n';
  sitioweb = sitioweb && sitioweb.trim() !== '' ? sitioweb : 's/n';
  telefono = telefono && telefono.trim() !== '' ? telefono : '00000000';
  celular = celular && celular.trim() !== '' ? celular : '00000000';
  try {
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
    const Proveedores = await Proveedor.find({});
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
  
// Actualizar un Proveedor
router.put('/actualizar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  let { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = req.body;
  try {
    console.log(telefono, celular)
    const fechaActual = new Date();
    let updateFields = { nombre_marca, correo, sitioweb, nombre_vendedor, correo_vendedor, fecha_actualizacion: fechaActual };
    if (celular !== '0') {updateFields.celular = celular;}
    if (telefono !== '00000000') {updateFields.telefono = telefono;}
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, updateFields, { new: true });
    if (!proveedorActualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado exitosamente', proveedorActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Proveedor' });
  }
});


module.exports = router;
