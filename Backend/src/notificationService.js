const { Expo } = require('expo-server-sdk');

let expo = new Expo();

async function sendNotification(token, data) {
  let messages = [];
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
  }

  messages.push({
    to: token,
    sound: 'default',
    body: 'Nueva notificación de predicción!',
    data: { data },
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { sendNotification };
