const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Notificacion = require('../models/Notificacion');
const Venta = require('../models/Venta');
const Prediccion = require('../models/Prediccion');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();
const cron = require('node-cron');

router.put('/actualizar/:token',verificacion, async (req, res) => {
  const { token } = req.params;
  const { id, estado } = req.body;  // Asegúrate de recibir el ID de la predicción a actualizar y el nuevo estado
  try {
    // Verificar si el nuevo estado es true y contar notificaciones activas
    if (estado === true) {
      // Obtener el documento por su token
      const notificacion = await Notificacion.findOne({ token: token });
      
      if (notificacion) {
        // Contar la cantidad de subdocumentos en notificaciones que tienen estado: true
        const count = notificacion.notificaciones.filter(n => n.estado === true).length;
        
        if (count >= 5) {
          return res.status(400).json({ mensaje: 'No se pueden tener más de 5 notificaciones activas' });
        }
      }
    }    

    const notificacionActualizada = await Notificacion.findOneAndUpdate(
      { token, 'notificaciones.prediccion': id }, // Filtro por token y predicción
      { $set: { 'notificaciones.$.estado': estado } }, // Actualiza el estado de la predicción específica
      { new: true } // Devuelve el documento actualizado
    );

    if (!notificacionActualizada) {
      return res.status(404).json({ mensaje: 'No se encontró la notificación o predicción con ese ID' });
    }

    res.status(200).json({ mensaje: 'Estado de la predicción actualizado exitosamente', notificacionActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la actualización de la predicción' });
  }
});

router.get('/mostrar/:id',verificacion, async (req, res) => {
  const { id } = req.params;  // Usar req.query para obtener el parámetro id
  console.log(id)
  try {
    if (!id) {
      return res.status(400).json({ mensaje: 'Token no proporcionado' });
    }

    const productosEncontrados = await Notificacion.find({ token: id })
      .populate('notificaciones.prediccion');

    const productosOrdenados = productosEncontrados.map(producto => {
      // Ordenar las notificaciones por estado (true primero)
      producto.notificaciones.sort((a, b) => b.estado - a.estado);
      return producto;
    });

    res.json(productosOrdenados);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las notificaciones' });
  }
});



router.post('/registrarToken', async (req, res) => {
  const { token } = req.body;
  // Validar que el token sea válido
  if (!token.startsWith('ExponentPushToken[')) {
      return res.status(400).send(`El token proporcionado: ${token} no es válido`);
  }

  try {
      // Buscar si ya existe un documento con el mismo token
      const tokenExistente = await Notificacion.findOne({ token });

      if (tokenExistente) {
          // Si el token ya existe, actualizamos las predicciones si es necesario
          const todasPredicciones = await Prediccion.find({});

          const prediccionesAAgregar = todasPredicciones
              .filter(prediccion => 
                  !tokenExistente.notificaciones.some(not => not.prediccion.equals(prediccion._id))
              )
              .map(prediccion => ({
                  prediccion: prediccion._id,
                  estado: false
              }));

          if (prediccionesAAgregar.length > 0) {
              // Agregar nuevas predicciones a las notificaciones del token existente
              await Notificacion.findOneAndUpdate(
                  { token },
                  { $addToSet: { notificaciones: { $each: prediccionesAAgregar } } }
              );
          }

          return res.status(200).send('El token ya está registrado y las predicciones se han actualizado.');
      }

      // Si el token no existe, creamos uno nuevo
      const todasPredicciones = await Prediccion.find({});

      const nuevasPredicciones = todasPredicciones.map(prediccion => ({
          prediccion: prediccion._id,
          estado: false
      }));

      const nuevaNotificacion = new Notificacion({
          token: token,
          notificaciones: nuevasPredicciones
      });

      // Guardar el nuevo documento en la base de datos
      const savedNotificacion = await nuevaNotificacion.save();
      console.log(savedNotificacion);

      res.status(201).send({ status: 'Token registrado correctamente con todas las predicciones', token: savedNotificacion });
  } catch (error) {
      console.error('Error al guardar el token:', error);
      res.status(500).send('Error al guardar el token');
  }
});

async function enviarNotificaciones() {
  const messages = [];
  const tokensToRemove = [];

  try {
    const notificacionesActivas = await Notificacion.find({ 'notificaciones.estado': true })
      .populate('notificaciones.prediccion');

    if (notificacionesActivas.length > 0) {
      const tokensSet = new Set(notificacionesActivas.map(notificacion => notificacion.token));
      const tokens = Array.from(tokensSet);

      const productosActivos = notificacionesActivas.flatMap(notificacion =>
        notificacion.notificaciones
          .filter(not => not.estado && not.prediccion.diaAgotamiento)
          .map(not => ({ ...not.prediccion._doc, estado: not.estado }))
      );

      productosActivos.forEach(producto => {
        tokens.forEach(token => {
          messages.push({
            token: token,
            notification: {
              title: 'Producto por agotarse',
              body: `El producto: ${producto.nombreProducto} se agotará en ${producto.diaAgotamiento} días!`,
            },
            data: { nombreProducto: producto.nombreProducto, info: 'Productos por agotarse' },
          });
        });
      });

      if (tokensToRemove.length > 0) {
        await Notificacion.updateMany(
          { token: { $in: tokensToRemove } },
          { $pull: { notificaciones: { token: { $in: tokensToRemove } } } }
        );
      }
    } else {
      console.log('No hay notificaciones activas para enviar.');
    }
  } catch (error) {
    console.error('Error al obtener o enviar notificaciones:', error);
  }
}


//* * * * *  0 */8 * * *
cron.schedule('* * * * *', () => {
  enviarNotificaciones();
});

module.exports = router;

