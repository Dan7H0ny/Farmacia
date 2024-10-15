import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InfoBarChar = ({ predicciones, titulo }) => {
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      if (!predicciones || predicciones.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
    }, 1000); // Ajusta el tiempo según sea necesario

    return () => clearTimeout(timer);
  }, [predicciones]);

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

  const RefrescarPagina = () => {
    window.location.reload();
  };

  return (
    <Card style={{
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      backgroundColor: '#0f1b35',
      border: '2px solid #e2e2e2',
      color: '#e2e2e2'
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {titulo}
          <IconButton onClick={RefrescarPagina} style={{ color: '#e2e2e2' }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <div style={{ height: '350px', position: 'relative' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
              <CircularProgress style={{ color: '#e2e2e2' }} />
            </Box>
          ) : noData ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
              <Typography variant="h6" style={{ color: '#e2e2e2' }}>
                El Producto no se encuentra dentro de la terminacion de los primeros 7 dias
              </Typography>
            </Box>
          ) : (
            <Line
              data={demandaFigureData}
              options={options}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default InfoBarChar;
