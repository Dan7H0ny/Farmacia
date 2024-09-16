import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, TextInput, Linking, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSwal from '../components/CustomSwal';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa la librería de iconos
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/PedidosStyles';

const Pedidos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [cantidad, setCantidad] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [productoDetails, setProductoDetails] = useState(null); // Nuevo estado para almacenar detalles del producto
  const itemsPerPage = 5;

  useEffect(() => {
    const FiltradoDeDatos = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`http://34.44.71.5/api/almacen/mostrar/pedidos`, {
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

  const fetchProductDetails = async (productoId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`http://34.44.71.5/api/producto/buscar/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductoDetails(response.data);
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error al extraer detalles del producto', mensaje: error.response.data.mensaje });
    }
  };

  const handleButtonClick = async (item, tipo) => {
    const proveedor = item.producto.proveedor || {}; 
    const productoNombre = item.producto.nombre;
  
    try {
      // Recuperar detalles del producto al presionar un botón
      await fetchProductDetails(item.producto._id);
  
      if (tipo === 'pedir') {
        setSelectedItem(item);
        setShowInput(true);
        return;
      }
  
      // Manejar redirección según el tipo
      switch (tipo) {
        case 'web':
          if (proveedor.sitioweb) {
            // Redirigir a la URL
            Linking.openURL(proveedor.sitioweb).catch((err) => console.error('Error al abrir la URL:', err));
          }
          break;
        case 'whatsapp':
          if (proveedor.telefono) {
            const mensaje = `Hola marca/empresa ${proveedor.nombre_marca},\n\nEstoy interesado en comprar ${cantidadPedida * item.producto.capacidad_presentacion} unidades de ${productoNombre}.`;
            const url = `whatsapp://send?phone=+591${proveedor.telefono}&text=${encodeURIComponent(mensaje)}`;
            Linking.openURL(url).catch((err) =>  Alert.alert('Error al ir al whatsapp', err));
          }
          break;
        case 'email':
          if (proveedor.correo) {
            const mensaje = `Hola marca/empresa ${proveedor.nombre_marca},\n\nEstoy interesado en comprar ${productoDetails?.cantidadEstimada?.toString() || '1'} unidades de ${productoNombre}.`;
            const url = `mailto:${proveedor.correo}?subject=Consulta sobre ${productoNombre}&body=${encodeURIComponent(mensaje)}`;
            Linking.openURL(url).catch((err) => console.error('Error al enviar el correo:', err));
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error en handleButtonClick:', error);
    }
  };
  

  const handleConfirmarEnvio = async () => {
    if (!selectedItem) return;
    const cantidadPedida = cantidad[selectedItem._id] || '';
    const productoNombre = selectedItem.producto.nombre;
  
    if (!cantidadPedida || isNaN(cantidadPedida) || Number(cantidadPedida) <= 0) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida (número entero positivo).');
      return;
    }
  
    Alert.alert(
      'Confirmar envío',
      `¿Está seguro que desea enviar el pedido del ${productoNombre}?`,
      [
        {
          text: 'Cancelar',
          onPress: () => {
            setShowInput(false);
            setSelectedItem(null);
          },
          style: 'cancel'
        },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.post(
                `http://34.44.71.5/api/pedidos/crear`,
                { 
                  producto: selectedItem.producto._id, 
                  cantidad: Number(cantidadPedida) * selectedItem.producto.capacidad_presentacion, 
                  precio: selectedItem.producto.capacidad_presentacion * selectedItem.producto.precioCompra, 
                  capacidad: selectedItem.producto.capacidad_presentacion 
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              CustomSwal({ icono: 'success', titulo: 'Pedido creado', mensaje: 'El pedido ha sido creado exitosamente.' });
              setShowInput(false);
              setSelectedItem(null);
            } catch (error) {
              CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'Hubo un problema al crear el pedido.' });
            }
          }
        }
      ]
    );
  };
  

  const filtrarProductos = productos.filter(p =>
    p.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCantidadChange = (value) => {
    // Eliminar caracteres no numéricos y decimales
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setCantidad(prev => ({ ...prev, [selectedItem._id]: cleanedValue }));
  };
  

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
              setCurrentPage(1);
            }}
          />
        </View>
        <FlatList
          data={DsProductos}
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
          renderItem={({ item }) => {
            const proveedor = item.producto.proveedor || {};
            return (
              <View style={styles.notificationItem}>
                <Text style={styles.itemText}>{item.producto.nombre}</Text>
                <View style={styles.rightContainer}>
                  {showInput && selectedItem?._id === item._id ? (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputCantidad}
                        placeholder={productoDetails?.cantidadEstimada?.toString() || '1'}
                        keyboardType="numeric"
                        value={cantidad[item._id] ? cantidad[item._id].toString() : ''}
                        onChangeText={handleCantidadChange}
                      />
                      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarEnvio}>
                        <Icon name="check" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
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
                      <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(item, 'pedir')}>
                        <Icon name="inventory" size={24} color="#fff" />
                      </TouchableOpacity>
                    </>
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
