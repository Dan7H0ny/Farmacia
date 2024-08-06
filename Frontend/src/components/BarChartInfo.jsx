import React, { useState, useEffect, useCallback } from 'react';
import CustomSwal from '../components/CustomSwal';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import {DateRange} from '@mui/icons-material';
import SyncIcon from '@mui/icons-material/Sync';
import CustomRegisterUser from '../components/CustomRegisterUser';
import axios from 'axios';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BarChartInfo = () => {
  const [predicciones, setPredicciones] = useState([]);
  const [producto, setProducto] = useState('');
  const [categoria, setCategoria] = useState('');
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;

  const obtenerPrediccionAgotamiento = useCallback(async () => {
    try {
      const response = await axios.post(`${UrlReact}/prediccion/mostrar/predicciones`);
      if (Array.isArray(response)) { // Accede a response.data
        const prediccionesFiltradas = response
        .filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7)
        .sort((a, b) => a.diaAgotamiento - b.diaAgotamiento) // Ordenar por diaAgotamiento de menor a mayor
        .slice(0, 5); 
        setPredicciones(prediccionesFiltradas);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.error});
    }
  }, [UrlReact]);

  const obtenerPrediccion = async () => {
    if (producto && categoria) {
      CustomSwal({ icono: 'warning', titulo: 'Error de entrada', mensaje: 'Por favor, llene solo un formulario' });
    } else if (producto) {
      try {
        const response = await axios.post(`${UrlReact}/prediccion/mostrar/nombre`, { nombreProducto: producto });
        setPredicciones(response); // Asegúrate de pasar response.data
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener las predicciones', mensaje: error.response?.data?.error || error.message });
      }
    } else if (categoria) {
      try {
        const response = await axios.post(`${UrlReact}/prediccion/mostrar/categoria`, { nombreCategoria: categoria });
        setPredicciones(response); // Asegúrate de pasar response.data
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener las predicciones', mensaje: error.response?.data?.error || error.message });
      }
    } else {
      obtenerPrediccionAgotamiento();
    }
  };
  

  useEffect(() => {
    obtenerPrediccionAgotamiento();
  }, [obtenerPrediccionAgotamiento]);

  // Obtener los días de la semana a partir de hoy
  const obtenerDiasSemana = () => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => diasSemana[(hoy + i) % 7]);
  };

  // Filtrar los 5 productos con mayores ventas sumadas
  const productosFiltrados = predicciones
    .map(producto => ({
      ...producto,
      totalVentas: producto.prediccion.ventas.reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.totalVentas - a.totalVentas);

    const coloresClaros = [
      '#add8e6CC', // LightBlue
      '#90ee90CC', // LightGreen
      '#ffb6c1CC', // LightPink
      '#f0e68cCC', // Khaki
      '#dda0ddCC'  // Plum
    ];
    

  const demandaFigureData = {
    labels: obtenerDiasSemana(),
    datasets: productosFiltrados.map((producto, index) => ({
      label: producto.nombreProducto,
      data: producto.prediccion ? producto.prediccion.ventas : [],
      borderColor: coloresClaros[index % coloresClaros.length],
      backgroundColor: coloresClaros[index % coloresClaros.length],
      borderWidth: 5,
      tension: 0.4,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e2e2' // Color de los textos de la leyenda
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e2e2e2', // Color de las etiquetas del eje X
        },
        grid: {
          color: '#e2e2e2', // Color de las líneas del eje X
        },
      },
      y: {
        ticks: {
          color: '#e2e2e2', // Color de las etiquetas del eje Y
        },
        grid: {
          color: '#e2e2e2', // Color de las líneas del eje Y
        },
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5, // Reducir padding inferior para reducir el tamaño vertical
      },
    },
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            PRODUCTOS VENDIDOS EN LOS PROXIMOS DIAS
          </Typography>
          <Grid container spacing={2}>
            <CustomRegisterUser
              number={6}
              label="Producto" 
              placeholder= 'Nombre del producto'
              type= 'type'
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required={false}
              icon={<DateRange/>}
            />
            <CustomRegisterUser
              number={6}
              label="Categoría" 
              placeholder= 'Ingrese la categoria de un producto'
              type= 'type'
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required={false}
              icon={<DateRange/>}
            />
          </Grid>
          <IconButton sx={{color:'#e2e2e2'}} aria-label="sync" onClick={obtenerPrediccion}>
            <SyncIcon />
          </IconButton>
        </Box>
        <div style={{ height: '300px'}}>
          <Line
            data={demandaFigureData}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default BarChartInfo;
