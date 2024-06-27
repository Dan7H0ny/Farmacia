import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useAutenticarContexto } from "../context/auntenticar.js";
import { useNavigation } from '@react-navigation/native';
import CustomTextField from '../components/CustomTextField.jsx';
import CustomSwal from '../components/CustomSwal.jsx';
import imagen from '../assets/LogoFar.png';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/LoginStyles';

export const Login = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { iniciarSesion } = useAutenticarContexto();
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
    setCorreo('');
    setPassword('');
  };

  const handleLoginSubmit = () => {
    axios.post('http://192.168.1.133:4000/login', { correo, password })
      .then(response => {
        CustomSwal({ icono: 'success', titulo: 'Acceso correcto', mensaje: response.mensaje });
        iniciarSesion(response._id, response.nombre, response.rol, response.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        if (response.rol === 'Administrador') {
          navigation.navigate('AdministradorMenu');
        } else if (response.rol === 'Cajero') {
          navigation.navigate('CajeroMenu');
        } else {
          navigation.navigate('Login');
        }
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Acceso Denegado', mensaje: error.mensaje });
      });
  };

  const handlePasswordResetSubmit = () => {
    axios.post('http://192.168.1.133:4000/enviarpin', { correo })
      .then(response => {
        CustomSwal({ icono: 'success', titulo: 'Envio correcto', mensaje: response.mensaje });
        navigation.navigate('Login');
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'El envio no se pudo concretar', mensaje: error.mensaje });
      });
  };

  const handleSubmit = () => {
    if (isSignIn) {
      handleLoginSubmit();
    } else {
      handlePasswordResetSubmit();
    }
  };

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={imagen} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={[styles.formContainer, isSignIn ? styles.signIn : styles.signUp]}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="account-circle" size={150} color="#e2e2e2" />
            </View>
            <Text style={styles.title}>{isSignIn ? 'INICIO DE SESION' : 'RESTABLECER CONTRASEÑA'}</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={24} color="#0f1b35" />
              <TextInput
                value={correo}
                onChangeText={(text) => setCorreo(text)}
                placeholder="Ingresa tu Correo"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
            {isSignIn && (
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#0f1b35" />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Ingresa tu Contraseña"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isSignIn ? 'INGRESAR AL SISTEMA' : 'RECUPERAR CONTRASEÑA'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleAuth}>
                <Text style={styles.buttonText}>{isSignIn ? '¿OLVIDASTE TU CONTRASEÑA?' : 'VOLVER AL INICIO DE SESIÓN'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Login;
