const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');
const verificacion = require('../middlewares/verificacion');

// Crear un Proveedor
router.post('/crear',verificacion, async (req, res) => {
  const { nombre_marca, correo, telefono, sitioweb } = req.body;
  try {
    const newproveedor = new Proveedor({ nombre_marca, correo, telefono, sitioweb });
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
  const { nombre_marca, correo, telefono, sitioweb } = req.body;
  try {
    const ProveedorActualizado = await Proveedor.findByIdAndUpdate(id,{ nombre_marca, correo, telefono, sitioweb }, { new: true });
    if (!ProveedorActualizado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json({ mensaje: 'Proveedor actualizado exitosamente ', ProveedorActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el Proveedor' });
  }
});
  
// Eliminar un Proveedor
router.delete('/eliminar/:id',verificacion, async (req, res) => {
  const { id } = req.params;
  try {
    const Proveedoreliminado = await Proveedor.findByIdAndDelete(id);
    if (!Proveedoreliminado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json({ mensaje: 'Proveedor eliminado exitosamente', Proveedoreliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar Proveedor' });
  }
});

module.exports = router;
