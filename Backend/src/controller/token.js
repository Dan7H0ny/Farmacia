const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

const cron = require('node-cron');
const Prediccion = require('../models/Prediccion');

router.post('/registrarToken', async (req, res) => {
    const { token, deviceId } = req.body;  // Asumiendo que recibes un deviceId para identificar el dispositivo
    if (!token.startsWith('ExponentPushToken[')) {
        return res.status(400).send(`El token proporcionado: ${token} no es válido en Expo`);
    }
    try {
        // Buscar y actualizar el token existente, o insertar uno nuevo si no existe
        const updatedToken = await Token.findOneAndUpdate(
            { deviceId: deviceId },  // Busca un documento con el mismo deviceId
            { token: token },        // Actualiza el token
            { new: true, upsert: true }  // Opciones para devolver el documento modificado y para insertar si no existe
        );

        res.send({ status: 'Token registrado correctamente', token: updatedToken });
    } catch (error) {
        res.status(500).send('Error al guardar el token');
    }
});


async function enviarNotificaciones() {
    const messages = [];
    const productosActivos = await Prediccion.find({ diaAgotamiento: { $exists: true, $ne: null } });

    if (productosActivos.length > 0) {
        const tokens = await Token.find(); // Obtener todos los tokens registrados
        productosActivos.forEach(producto => {
            tokens.forEach(({ token }) => {
                messages.push({
                    to: token,
                    sound: 'default',
                    body: `El producto: ${producto.nombreProducto} se agotara en ${producto.diaAgotamiento} dias!`,
                    data: { nombreProducto: producto.nombreProducto, info: 'Estos productos estan por agotarse' },
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
}

cron.schedule('0 0,12 * * *', () => {
    console.log('Ejecutando la tarea cada 12 horas.');
    enviarNotificaciones();
});

module.exports = router;

