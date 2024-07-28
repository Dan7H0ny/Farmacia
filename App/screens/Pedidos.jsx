import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input';
import CustomSwal from '../components/CustomSwal';
import URL_BASE from '../config';
import { LinearGradient } from 'expo-linear-gradient';

const Pedidos = () => {
  const [productos, setProductos] = useState([]);
  const [elegidos, setElegidos] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const FiltradoDeDatos = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${URL_BASE}/notificacion/mostrar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productosSinEstado = response.data.filter(notificacion => notificacion.estado === false); 
        setProductos(productosSinEstado);
        const activeNotificaciones = response.data.filter(notificacion => notificacion.estado === true);
        setNotificaciones(activeNotificaciones);
      }
    };
    FiltradoDeDatos();
  }, []);

  const BuscarProducto = (query) => {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    return productos.filter(notificacion => notificacion.producto.producto.nombre.search(regex) >= 0);
  };

  const opsSeleccion = (product) => {
    setSeleccion(prevState => prevState && prevState._id === product._id ? null : product);
    setElegidos(''); // Limpiar el campo de búsqueda
  };

  const SwitchEstado = async (producto) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const updatedEstado = !producto.estado;
      await axios.put(`${URL_BASE}/notificacion/actualizar`, {
        id: producto._id,
        estado: updatedEstado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificaciones(prevNotificaciones => prevNotificaciones.map(p => p._id === producto._id ? { ...p, estado: updatedEstado } : p));
      CustomSwal({ icono: 'success', titulo: 'Estado Actualizado', mensaje: 'Actualización exitosa' });
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error', mensaje: error.response.data.mensaje });
    }
  };

  const filteredProducts = BuscarProducto(elegidos);

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {seleccion && (
          <View style={styles.selectedProductView}>
            <Text style={styles.itemText}>{seleccion.producto.producto.nombre}</Text>
            <Switch
              value={seleccion.estado}
              onValueChange={() => SwitchEstado(seleccion)}
              style={styles.switch}
            />
          </View>
        )}
        <Autocomplete
          data={filteredProducts}
          defaultValue={elegidos}
          onChangeText={text => setElegidos(text)}
          placeholder="Buscar Producto"
          flatListProps={{
            keyExtractor: item => item._id.toString(),
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => opsSeleccion(item)} style={styles.item}>
                <Text style={styles.itemText}>{item.producto.producto.nombre}</Text>
              </TouchableOpacity>
            ),
            ListEmptyComponent: null
          }}
          inputContainerStyle={styles.autocompleteContainer}
          containerStyle={styles.autocompleteWrapper}
        />
        <FlatList
          data={notificaciones}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.itemText}>{item.producto.producto.nombre}</Text>
              <Switch
                value={item.estado}
                onValueChange={() => SwitchEstado(item)}
                style={styles.switch}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#d1c4e9',
    borderRadius: 5,
  },
  selectedProductView: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#c5e1a5',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switch: {
    marginLeft: 10,
  },
  autocompleteContainer: {
    borderWidth: 0,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  autocompleteWrapper: {
    marginBottom: 10,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default Pedidos;