import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const CustomTextField = ({ id, label, value, onChangeText, placeholder, required, icon, keyboardType, secureTextEntry }) => {
  return (
    <View style={styles.inputContainer}>
      {icon && <MaterialIcons name={icon} size={24} color="#0f1b35" />}
      <TextInput
        id={id}
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType} // Tipo de teclado según la propiedad recibida
        secureTextEntry={secureTextEntry} // Para campos de contraseña
        autoCapitalize="none" // Desactiva la autocapitalización
        autoCorrect={false} // Desactiva la corrección automática
        required={required}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco para el input
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    color: '#000', // Color del texto en el input
    padding: 10,
  },
});

export default CustomTextField;
