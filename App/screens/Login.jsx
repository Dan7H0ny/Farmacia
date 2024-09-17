import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useAutenticarContexto } from "../context/AutenticacionContexto";
import { useNavigation } from '@react-navigation/native';
import CustomSwal from '../components/CustomSwal';
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

  const validateEmail = (email) => {
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const opCambio = () => {
    setIsSignIn(!isSignIn);
    setCorreo('');
    setPassword('');
  };

  const opIniciarSesion = () => {
    if (correo === '' || password === '') {
      CustomSwal({ icono: 'error', titulo: 'Campos requeridos', mensaje: 'Por favor, completa todos los campos.' });
      return;
    }
    if (!validateEmail(correo)) {
      CustomSwal({ icono: 'error', titulo: 'Correo inválido', mensaje: 'Por favor, ingresa un correo electrónico válido.' });
      return;
    }
    axios.post(`https://antony.ajayuhost.com/api/login`, { correo, password })
      .then(response => {
        const { _id, nombre, rol, token, mensaje } = response.data;
        CustomSwal({ icono: 'success', titulo: 'Acceso correcto', mensaje: mensaje });
        iniciarSesion(_id, nombre, rol, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (rol === 'Administrador') {
          () => navigation.navigate('Menu');
        } else {
          CustomSwal({ icono: 'error', titulo: 'Acceso Denegado', mensaje: 'No tienes permisos de administrador' });
        }
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Acceso Denegado', mensaje: error.response.data.mensaje });
      });
  };

  const opRestablecerPassword = async () => {
    if (correo === '') {
      CustomSwal({ icono: 'error', titulo: 'Correo requerido', mensaje: 'Por favor, ingresa tu correo electrónico.' });
      return;
    }
    if (!validateEmail(correo)) {
      CustomSwal({ icono: 'error', titulo: 'Correo inválido', mensaje: 'Por favor, ingresa un correo electrónico válido.' });
      return;
    }

    try {
      // Mostrar la animación de carga
      CustomSwal({
        icono: 'info',
        titulo: 'CARGANDO...',
        mensaje: '', // Mensaje vacío mientras se muestra la carga
        loading: true
      });
  
      const response = await axios.post(`https://antony.ajayuhost.com/api/enviarpin`, { correo });
      // Mostrar el mensaje de éxito
      CustomSwal({
        icono: 'success',
        titulo: 'Envio correcto',
        mensaje: response.data.mensaje,
      });
    } catch (error) {
      // Cerrar la animación de carga
      hideMessage();
      // Mostrar el mensaje de error
      CustomSwal({
        icono: 'error',
        titulo: 'El envio no se pudo concretar',
        mensaje: error.response?.data?.mensaje || error.message,
      });
    }
  };

  const opMain = () => {
    if (isSignIn) {
      opIniciarSesion();
    } else {
      opRestablecerPassword();
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
              <TouchableOpacity style={styles.button} onPress={opMain}>
                <Text style={styles.buttonText}>{isSignIn ? 'INGRESAR AL SISTEMA' : 'RECUPERAR CONTRASEÑA'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={opCambio}>
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
