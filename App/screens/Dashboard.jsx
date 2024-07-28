import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import URL_BASE from '../config';

const Dashboard = () => {
  const [dataMain, setData] = useState({});
  const [productos, setProductos] = useState([]);
  const [mostrarCaducidad, setMostrarCaducidad] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const cargarToken = async () => {
      const tokenGuardado = await AsyncStorage.getItem('token');
      if (tokenGuardado) {
        setToken(tokenGuardado);
      }
    };
    cargarToken();
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(`${URL_BASE}/almacen/mostrar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setProductos(response.data);
        MostrarDatos(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [token, URL_BASE]);

  const MostrarDatos = (data) => {
    const filteredData = data.slice(0, 5).map((item, index) => ({
      name: item.producto.nombre,
      population: item.cantidad_stock,
      color: `hsl(${index * 36}, 70%, 70%)`,
      legendFontColor: '#e2e2e2',
      legendFontSize: 15
    }));

    setData({
      labels: filteredData.map(item => item.name),
      data: filteredData,
      legend: filteredData
    });
  };

  const toggleCaducidad = () => {
    setMostrarCaducidad(!mostrarCaducidad);
    MostrarDatos(productos);
  };

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {mostrarCaducidad ? 'Productos Próximos a Caducar' : 'Productos con Bajo Stock'}
          </Text>
          {dataMain.data && (
            <PieChart
              data={dataMain.data}
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#1E2923',
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          )}
          <TouchableOpacity style={styles.button} onPress={toggleCaducidad}>
            <Text style={styles.buttonText}>{mostrarCaducidad ? 'Mostrar Bajo Stock' : 'Mostrar Caducidad'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center', // Asegura que todo el contenido se centre horizontalmente
    backgroundColor: '#0f1b35',
    padding: 20,
    borderRadius: 10,
    marginTop: 20, // Agrega un poco de margen superior
  },
  title: {
    fontSize: 24,
    color: '#e2e2e2',
    marginBottom: 20,
    textAlign: 'center', // Centra el texto del título
  },
  button: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#0f1b35',
    fontSize: 16,
    textAlign: 'center', // Centra el texto dentro del botón
  }
});

export default Dashboard;
