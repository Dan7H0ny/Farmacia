import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Pedidos = () => {
  const handleSendNotification = async () => {
    const token = 'YourExpoTokenHere'; // Este token debería ser almacenado o recuperado del estado global o almacenamiento seguro
    const message = "Este es un mensaje de prueba desde la vista de Pedidos";

    // Utilizar fetch para enviar una solicitud POST al backend
    fetch('http://your-backend-url.com/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, message })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <Button
        title="Enviar Notificación"
        onPress={handleSendNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Pedidos;
