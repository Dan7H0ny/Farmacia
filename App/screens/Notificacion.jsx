import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Switch, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import axios from 'axios';
import CustomSwal from '../components/CustomSwal';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/NotificacionStyles';
import * as Notifications from 'expo-notifications';

const URL_BASE = 'https://antony.ajayuhost.com/api'; // Asegúrate de definir esta constante correctamente

const Notificacion = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const expoPushToken = await Notifications.getExpoPushTokenAsync({
          projectId: 'farmacia-74f41' // Reemplaza con tu projectId
        });
        if (token) {
          const response = await axios.get(`${URL_BASE}/notificacion/mostrar/${expoPushToken}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNotificaciones(response.data);
        }
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'No se pudieron cargar las notificaciones' });
      }
    };
    fetchNotificaciones();
  }, []);

  const SwitchEstado = async (producto) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedEstado = !producto.estado; // Alterna el estado
      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: 'farmacia-74f41' // Reemplaza con tu projectId
      });
      console.log(expoPushToken, producto.prediccion._id, updatedEstado)
      
      await axios.put(`${URL_BASE}/notificacion/actualizar/${expoPushToken}`, 
        { 
          id: producto.prediccion._id,
          estado: updatedEstado 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotificaciones(prevNotificaciones => prevNotificaciones.map(notificacion => 
        notificacion.token === expoPushToken ? { 
          ...notificacion, 
          notificaciones: notificacion.notificaciones.map(prediccion => 
            prediccion._id === producto._id ? { ...prediccion, estado: updatedEstado } : prediccion
          )
        } : notificacion
      ));
      
      CustomSwal({ icono: 'success', titulo: 'Estado Actualizado', mensaje: 'Actualización exitosa' });
    } catch (error) {
      console.error(error);
      CustomSwal({ icono: 'error', titulo: 'Error', mensaje: error.response?.data?.mensaje || 'Error en la actualización' });
    }
  };

  const filteredNotificaciones = notificaciones.flatMap(not => 
    not.notificaciones.filter(prediccion => 
      prediccion.prediccion && prediccion.prediccion.nombreProducto && 
      prediccion.prediccion.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredNotificaciones.length / itemsPerPage);

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

  const displayedNotificaciones = filteredNotificaciones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          data={displayedNotificaciones}
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.itemText}>{item.prediccion.nombreProducto}</Text>
              <Switch
                value={item.estado}
                onValueChange={() => SwitchEstado(item)}  // Pasa el nuevo estado
                style={styles.switch}
              />
            </View>
          )}
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

export default Notificacion;
