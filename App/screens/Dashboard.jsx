import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/DashboardStyles';

const Dashboard = () => {
  const [dataMain, setData] = useState({});
  const [productos, setProductos] = useState([]);
  const [prediccion, setPrediccion] = useState([]);
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
      axios.get(`http://34.44.71.5/api/almacen/mostrar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setProductos(response.data);
        MostrarDatos(response.data, mostrarCaducidad);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [token, mostrarCaducidad]);

  useEffect(() => {
    if (token) {
      axios.post(`http://34.44.71.5/api/prediccion/mostrar/predicciones`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const prediccionesFiltradas = response.data
        .filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7)
        .sort((a, b) => a.diaAgotamiento - b.diaAgotamiento) // Ordenar por diaAgotamiento de menor a mayor
        .slice(0, 10);
        setPrediccion(prediccionesFiltradas);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [token]);

  const MostrarDatos = (data, filtroPorCaducidad) => {
    const sortedProductos = data.sort((a, b) => filtroPorCaducidad
      ? new Date(a.fecha_caducidad) - new Date(b.fecha_caducidad)
      : a.cantidad_stock - b.cantidad_stock
    ).slice(0, 5);

    const chartData = sortedProductos.map((item, index) => ({
      name: item.producto.nombre,
      population: item.cantidad_stock,
      color: `hsl(${index * 36}, 70%, 70%)`,
      legendFontColor: '#e2e2e2',
      legendFontSize: 15
    }));

    setData({
      labels: chartData.map(item => item.name),
      data: chartData,
      legend: chartData
    });
  };

  const toggleView = () => {
    const nuevoEstado = !mostrarCaducidad;
    setMostrarCaducidad(nuevoEstado);
    MostrarDatos(productos, nuevoEstado);
  };

  return (
    <LinearGradient colors={['#e0ffff', '#91daff']} style={styles.gradient}>
      <FlatList
        data={prediccion}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {mostrarCaducidad ? 'Productos Próximos a Caducar' : 'Productos con Bajo Stock'}
            </Text>
            {dataMain.data && (
              <PieChart
                data={dataMain.data}
                width={Dimensions.get('window').width - 80}
                height={200}
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
            <TouchableOpacity style={styles.button} onPress={toggleView}>
              <Text style={styles.buttonText}>
                {mostrarCaducidad ? 'Mostrar Bajo Stock' : 'Mostrar Próximos a Caducar'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <View style={styles.predictionsContainer}>
              <Text style={styles.subtitle}>Productos por acabar</Text>
              {prediccion.map((item, index) => (
                <View key={item._id || index} style={styles.predictionRow}>
                  <Text style={styles.productName}>{item.nombreProducto}</Text>
                  <Text style={styles.daysLeft}>{item.diaAgotamiento} días</Text>
                </View>
              ))}
            </View>
          </View>
        }
        contentContainerStyle={styles.scrollContainer}
      />
    </LinearGradient>
  );
};

export default Dashboard;

