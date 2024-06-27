import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './screens/Login';
import { AutenticarContextoProveedor } from './context/auntenticar';
import FlashMessage from 'react-native-flash-message';

const Stack = createStackNavigator();

function App() {
  return (
    <AutenticarContextoProveedor>
      <NavigationContainer>
        <Stack.Navigator>
          {<Stack.Screen name="Inicio de sesion" component={Login} />}
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    </AutenticarContextoProveedor>
  );
}

export default App;

