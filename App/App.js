import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AutenticarContextoProveedor, useAutenticarContexto } from './context/AutenticacionContexto';
import Login from './screens/Login';
import Menu from './screens/Menu';
import Dashboard from './screens/Dashboard';
import Notificacion from './screens/Notificacion';
import Pedidos from './screens/Pedidos';
import FlashMessage from 'react-native-flash-message';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { rol, autenticado } = useAutenticarContexto();

  return (
    <Stack.Navigator initialRouteName="Login">
      {!autenticado ? (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      ) : rol === 'Administrador' ? (
        <>
          <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Notificacion" component={Notificacion} options={{ headerShown: false }} />
          <Stack.Screen name="Pedidos" component={Pedidos} options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  
    // Enviar el token al backend
    const response = await fetch('https://your-backend-url.com/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token
      }),
    });
  
    const data = await response.json();
    console.log('Token saved:', data);
  }  

  return (
    <AutenticarContextoProveedor>
      <NavigationContainer>
        <AppNavigator />
        <FlashMessage position="top" />
      </NavigationContainer>
    </AutenticarContextoProveedor>
  );
};

export default App;
