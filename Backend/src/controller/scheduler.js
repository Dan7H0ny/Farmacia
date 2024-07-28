const cron = require('node-cron');
const Prediccion = require('../models/Prediccion'); // Asegúrate de que la ruta al modelo es correcta
const { sendNotification } = require('../notificationService'); // Servicio de notificación

// Función para verificar y enviar notificaciones
async function checkAndSendNotifications() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const predictions = await Prediccion.find({
    diaAgotamiento: { $ne: null } // Encuentra predicciones donde diaAgotamiento no es null
  });

  predictions.forEach(async (prediction) => {
    if (prediction.diaAgotamiento && prediction.diaAgotamiento > 0) { // Verificar que diaAgotamiento tenga datos
      // Obtener el token de notificación del usuario asociado a la predicción si es necesario
      // Esto requiere que tu modelo de usuario almacene tokens de notificación
      const userToken = ''; // Aquí deberías obtener el token real de algún lugar

      const message = `Alerta de agotamiento: ${prediction.nombreProducto} se agotará en ${prediction.diaAgotamiento} días.`;
      await sendNotification(userToken, { title: "Alerta de Inventario", body: message });
    }
  });
}

// Programar la tarea para ejecutarse todos los días a la medianoche
cron.schedule('0 0 * * *', () => {
  console.log('Ejecutando la tarea diaria de verificación de predicciones.');
  checkAndSendNotifications();
});
const express = require('express');
const router = express.Router();

router.post('/api/tokens', async (req, res) => {
    const { token } = req.body;
    try {
      // Aquí deberías asociar el token con un usuario o dispositivo específico en tu DB
      const result = await User.findByIdAndUpdate(req.user.id, { pushToken: token }, { new: true });
      res.status(200).json({ message: 'Token saved successfully', data: result });
    } catch (error) {
      console.error('Error saving token:', error);
      res.status(500).json({ message: 'Error saving token', error: error });
    }
  });

module.exports = router;

