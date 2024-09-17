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
import axios from 'axios';
import { Alert, Linking } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

const registrarNotificacionesActivadas = async () => {
  if (!Device.isDevice) {
    Alert.alert('Debes usar un dispositivo físico para las notificaciones push.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permisos Requeridos',
      'Por favor, habilita los permisos de notificaciones.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() }
      ],
      { cancelable: false }
    );
    return;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await AsyncStorage.setItem('expoPushToken', token);
    await axios.post(`https://antony.ajayuhost.com/api/notificacion/registrarToken`, { token });
  } catch (error) {
    console.error('Error al obtener el token de notificaciones:', error);
  }
};

const App = () => {
  const navigationRef = React.useRef();
  
  useEffect(() => {
    registrarNotificacionesActivadas();
    
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {});

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      navigationRef.current?.navigate('Pedidos');
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <AutenticarContextoProveedor>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
        <FlashMessage position="top" />
      </NavigationContainer>
    </AutenticarContextoProveedor>
  );
};

export default App;
