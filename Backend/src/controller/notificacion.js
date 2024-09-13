const express = require('express');
const router = express.Router();
const verificacion = require('../middlewares/verificacion');
const Notificacion = require('../models/Notificacion');
const Venta = require('../models/Venta');
const Prediccion = require('../models/Prediccion');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();
const cron = require('node-cron');

router.put('/actualizar', verificacion, async (req, res) => {
  const { token } = req.query;
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

router.get('/mostrar', verificacion, async (req, res) => {
  const { id } = req.query;  // Usar req.query para obtener el parámetro id

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

    try {
        // Obtener todas las notificaciones activas
        const notificacionesActivas = await Notificacion.find({ 'notificaciones.estado': true })
            .populate('notificaciones.prediccion');

        // Extraer todos los tokens únicos
        const tokensSet = new Set(notificacionesActivas.map(notificacion => notificacion.token));
        const tokens = Array.from(tokensSet);

        if (notificacionesActivas.length > 0) {
            // Filtrar las predicciones con diaAgotamiento definido
            const productosActivos = notificacionesActivas.flatMap(notificacion => 
                notificacion.notificaciones
                    .filter(not => not.estado && not.prediccion.diaAgotamiento)
                    .map(not => ({ 
                        ...not.prediccion._doc, 
                        estado: not.estado 
                    }))
            );

            if (productosActivos.length > 0) {
                productosActivos.forEach(producto => {
                    tokens.forEach(token => {
                        messages.push({
                            to: token,
                            sound: 'default',
                            body: `El producto: ${producto.nombreProducto} se agotará en ${producto.diaAgotamiento} días!`,
                            data: { nombreProducto: producto.nombreProducto, info: 'Estos productos están por agotarse' },
                        });
                    });
                });

                let chunks = expo.chunkPushNotifications(messages);

                try {
                    for (let chunk of chunks) {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log('Tickets de notificación:', ticketChunk);
                    }
                } catch (error) {
                    console.error('Error al enviar notificaciones:', error);
                }
            } else {
                console.log('No hay productos activos con bajo día de agotamiento para notificar.');
            }
        } else {
            console.log('No hay notificaciones activas para enviar.');
        }
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
    }
}

async function obtenerVentasUltimaHora() {
  try {
    // Calcular la hora actual y la hora de hace una hora
    const ahora = new Date();
    const haceUnaHora = new Date(ahora.getTime() - 60 * 60 * 1000);

    // Consulta para obtener las ventas de la última hora
    const ventas = await Venta.aggregate([
      { 
        $match: { 
          fecha_registro: { $gte: haceUnaHora, $lte: ahora } // Filtrar por la última hora
        }
      },
      {
        $unwind: '$productos' // Desagregar el array de productos
      },
      {
        $group: {
          _id: '$productos.producto', // Agrupar por el ObjectId del producto en Almacen
          totalVentas: { $sum: '$productos.cantidad_producto' }, // Sumar la cantidad vendida
          nombreProducto: { $first: '$productos.nombre' } // Tomar el primer nombre del producto
        }
      }
    ]);

    // Si hay ventas, extraemos los IDs de los productos vendidos
    if (ventas.length > 0) {
      const productosVendidosIds = ventas.map(venta => venta._id.toString()); // Convertir ObjectIds a strings si es necesario
      console.log('Productos vendidos en la última hora (IDs):', productosVendidosIds);
      return productosVendidosIds;
    } else {
      console.log('No hay ventas en la última hora.');
      return [];
    }
  } catch (error) {
    console.error('Error al obtener ventas de la última hora:', error);
    throw error;
  }
}


cron.schedule('* 1 * * *', () => {
  enviarNotificaciones();
});

module.exports = router;

