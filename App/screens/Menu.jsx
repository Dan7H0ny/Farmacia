import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAutenticarContexto } from '../context/AutenticacionContexto';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/MenuStyles';

const Menu = () => {
  const navigation = useNavigation();
  const { cerrarSesion } = useAutenticarContexto();

  const handleLogout = async () => {
    await cerrarSesion();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Icon name="dashboard" size={30} color="#fff" />
          <Text style={styles.menuText}>DASHBOARD</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notificacion')} 
        >
          <Icon name="notifications" size={30} color="#fff" />
          <Text style={styles.menuText}>NOTIFICACION</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Pedidos')}
        >
          <Icon name="shopping-cart" size={30} color="#fff" />
          <Text style={styles.menuText}>PEDIDOS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Icon name="exit-to-app" size={30} color="#fff" />
          <Text style={styles.menuText}>CERRAR SESION</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Menu;
