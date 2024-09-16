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
import { Alert, Linking  } from 'react-native';
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
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    // Si no se han otorgado, solicitarlos
    const permissions = await Notifications.requestPermissionsAsync();
    finalStatus = permissions.status;
  }
  if (finalStatus !== 'granted') {
    // Si los permisos no son concedidos, informar al usuario que debe habilitarlos manualmente
    Alert.alert(
      'Permisos Requeridos',
      'Cambie los permisos de notificacion',
      [
        { text: 'Cancel', style: 'cancel' },
        // Abrir la configuración del sistema si es posible
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ],
      { cancelable: false }
    );
    return;
  }

  const expoPushToken  = await Notifications.getExpoPushTokenAsync();
  const token = expoPushToken.data;
  await AsyncStorage.setItem('expoPushToken', token);
  // Enviar el token y el deviceId al servidor
  try {
    await axios.post(`http://34.44.71.5/api/notificacion/registrarToken`, { token });
  } catch (error) {
    console.error('Error al registrar el token:', error);
  }
};

const App = () => {
  const navigationRef = React.useRef();
  useEffect(() => {
    registrarNotificacionesActivadas();
    // Este escuchador es llamado siempre que una notificación es recibida mientras la app está en primer plano
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    });

    // Este escuchador es llamado siempre que el usuario interactúa con la notificación (tocándola cuando está fuera de la app)
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
      <NavigationContainer  ref={navigationRef}>
        <AppNavigator />
        <FlashMessage position="top" />
      </NavigationContainer>
    </AutenticarContextoProveedor>
  );
};

export default App;
