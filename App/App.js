import React, { useEffect, useRef } from 'react';
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
import { Alert, Linking, Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración del manejador de notificaciones
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

  try {
    // Comprobar y solicitar permisos de notificaciones
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
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '94f2f36a-c0e4-4828-906b-d0470b6753af' // Reemplaza con tu projectId correcto
    });
    const token = tokenData.data;
    // `tokenData` ya contiene el token directamente
    console.log('Token de notificaciones obtenido:', token);

    // Guarda el token en almacenamiento local y envíalo al backend
    await AsyncStorage.setItem('expoPushToken', token);
    await axios.post('https://antony.ajayuhost.com/api/notificacion/registrarToken', { token });

  } catch (error) {
    console.error('Error al obtener el token de notificaciones:', error);
  }

  // Configurar el canal de notificaciones para Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
    });
  }
};

const App = () => {
  const navigationRef = useRef();

  useEffect(() => {
    registrarNotificacionesActivadas();

    // Listener para manejar notificaciones en primer plano
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida en primer plano:', notification);
    });

    // Listener para manejar cuando el usuario interactúa con una notificación
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      console.log('Usuario interactuó con la notificación:', data);

      if (data && data.nombreProducto) {
        navigationRef.current?.navigate('Pedidos', { producto: data.nombreProducto });
      } else {
        navigationRef.current?.navigate('Pedidos');
      }
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
