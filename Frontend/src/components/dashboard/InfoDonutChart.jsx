import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InfoDonutChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [productos, setProductos] = useState([]);
  const [mostrarCaducidad, setMostrarCaducidad] = useState(true);
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` }}), [token]);

  useEffect(() => {
    const DatosAlmacen = async () => {
      try {
        const response = await axios.get(`${UrlReact}/almacen/mostrar`, configInicial);
        setProductos(response);
        actualizarDatos(response);
      } catch (error) {
        console.error('Error fetching product data', error);
      }
    };

    DatosAlmacen();
  }, [UrlReact, configInicial]);

  const actualizarDatos = (productos, filtroPorCaducidad = true) => {
    const sortedProductos = productos.sort((a, b) => filtroPorCaducidad
      ? new Date(a.fecha_caducidad) - new Date(b.fecha_caducidad)
      : a.cantidad_stock - b.cantidad_stock
    ).slice(0, 10);

    const colors = [
      '#a4c2f4CC', // Azul claro
      '#f4a4a4CC', // Rojo claro
      '#a4f4a4CC', // Verde claro
      '#cda4f4CC', // Púrpura claro
      '#f4c6a4CC', // Naranja claro
      '#a4a4f4CC', // Índigo claro
      '#f4f4a4CC', // Amarillo claro
      '#a4f4f4CC', // Cian claro
      '#f4a4f4CC', // Magenta claro
      '#f4f1d8CC'  // Crema claro
    ];
    
    const borderColors = [
      '#a4c2f4', // Azul claro
      '#f4a4a4', // Rojo claro
      '#a4f4a4', // Verde claro
      '#cda4f4', // Púrpura claro
      '#f4c6a4', // Naranja claro
      '#a4a4f4', // Índigo claro
      '#f4f4a4', // Amarillo claro
      '#a4f4f4', // Cian claro
      '#f4a4f4', // Magenta claro
      '#f4f1d8'  // Crema claro
    ];
    
    setChartData({
      labels: sortedProductos.map(item => item.producto.nombre),
      datasets: [{
        label: 'Stock de Productos',
        data: sortedProductos.map(item => item.cantidad_stock),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    });
  };

  const handleMostrarCaducidad = () => {
    actualizarDatos(productos, true);
    setMostrarCaducidad(true);
  };

  const handleMostrarStock = () => {
    actualizarDatos(productos, false);
    setMostrarCaducidad(false);
  };

  return (
    <Card style={{
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      backgroundColor: '#0f1b35',
      border: '2px solid #e2e2e2',
      color: '#e2e2e2'
    }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center">
          {mostrarCaducidad ? '10 PRODUCTOS PRÓXIMOS A CADUCAR' : '10 PRODUCTOS CON BAJO STOCK'}
        </Typography>
        <div style={{ height: '350px'}}>
        <Doughnut data={chartData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e2e2e2'
              }
            }
          }
        }} /></div>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              onClick={handleMostrarCaducidad} disabled={mostrarCaducidad}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                marginTop: 2.5,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #e2e2e2',
                },
              }}
            >Proximos a Caducar
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              onClick={handleMostrarStock} disabled={!mostrarCaducidad}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                marginTop: 2.5,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #e2e2e2',
                },
              }}
            >Bajo Stock
            </Button>
        </Box>
    </Card>
  );
}

export default InfoDonutChart;
