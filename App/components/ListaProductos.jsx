import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const productos = [
  { id: '1', nombre: 'Producto 1' },
  { id: '2', nombre: 'Producto 2' },
  { id: '3', nombre: 'Producto 3' },
];

const ListaProductos = () => {
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(item => item !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const renderProducto = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nombre}</Text>
      <TouchableOpacity onPress={() => toggleSeleccion(item.id)}>
        <Icon
          name={seleccionados.includes(item.id) ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color="#0f1b35"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={productos}
      renderItem={renderProducto}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default ListaProductos;
