import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, TextInput, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSwal from '../components/CustomSwal';
import URL_BASE from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa la librería de iconos
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/PedidosStyles';

const Pedidos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const FiltradoDeDatos = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${URL_BASE}/almacen/mostrar/pedidos`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProductos(response.data);
        } catch (error) {
          CustomSwal({ icono: 'error', titulo: 'Error al extraer datos', mensaje: error.response.data.mensaje });
        }
      }
    };
    FiltradoDeDatos();
  }, []);

  const handleButtonClick = (item, tipo) => {
    const proveedor = item.producto.proveedor || {}; // Manejar si proveedor es undefined
  
    switch (tipo) {
      case 'web':
        if (proveedor.sitioweb) {
          // Redirigir a la URL
          Linking.openURL(proveedor.sitioweb).catch((err) => console.error('Error al abrir la URL:', err));
        }
        break;
      case 'whatsapp':
        if (proveedor.telefono) {
          // Iniciar un chat en WhatsApp
          const url = `whatsapp://send?phone=+591${proveedor.telefono}`;
          Linking.openURL(url).catch((err) => console.error('Error al abrir WhatsApp:', err));
        }
        break;
      case 'email':
        if (proveedor.correo) {
          // Enviar un correo electrónico
          const url = `mailto:${proveedor.correo}`;
          Linking.openURL(url).catch((err) => console.error('Error al enviar el correo:', err));
        }
        break;
      default:
        break;
    }
  };

  // Filtrar los productos según el término de búsqueda
  const filtrarProductos = productos.filter(p =>
    p.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular el número total de páginas basado en los productos filtrados
  const totalPages = Math.ceil(filtrarProductos.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const DsProductos = filtrarProductos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre del producto..."
            value={searchTerm}
            onChangeText={text => {
              setSearchTerm(text);
              setCurrentPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
            }}
          />
        </View>
        <FlatList
          data={DsProductos}
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
          renderItem={({ item }) => {
            const proveedor = item.producto.proveedor || {}; // Manejar si proveedor es undefined
            return (
              <View style={styles.notificationItem}>
                <Text style={styles.itemText}>{item.producto.nombre}</Text>
                <View style={styles.buttonContainer}>
                  {proveedor.sitioweb && (
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(item, 'web')}>
                      <Icon name="public" size={24} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {proveedor.telefono && (
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(item, 'whatsapp')}>
                      <FontAwesome name="whatsapp" size={24} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {proveedor.correo && (
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(item, 'email')}>
                      <Icon name="email" size={24} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1} style={styles.paginationButton}>
            <Text style={styles.paginationText}>Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>{currentPage} de {totalPages}</Text>
          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages} style={styles.paginationButton}>
            <Text style={styles.paginationText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Pedidos;
