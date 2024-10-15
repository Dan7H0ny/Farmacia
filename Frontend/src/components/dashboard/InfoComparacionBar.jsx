import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InfoComparacionBar = ({ comparacion: prediccion }) => {
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => {
      setLoading(false);
      if (!prediccion || prediccion.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [prediccion]);

  const nombre = prediccion[0]?.producto || 'Producto';
  const comparacionNueva = prediccion[0]?.comparacion || [];
  const fechas = comparacionNueva.map(item => item.fecha);
  const predicciones = comparacionNueva.map(item => item.prediccion);
  const reales = comparacionNueva.map(item => item.real);

  const demandaFigureData = {
    labels: fechas,
    datasets: [
      {
        label: 'Ventas realizadas por predicción',
        data: predicciones,
        borderColor: '#4caf50', // Color verde para predicción
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Ventas reales realizadas',
        data: reales,
        borderColor: '#2196f3', // Color azul para ventas reales
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e2e2', // Color de las etiquetas de la leyenda
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const ventaReal = reales[index] || 0;
            const ventaPredicha = predicciones[index] || 0;

            // Calcular el porcentaje
            const percentage = ventaPredicha > 0 ? ((ventaReal / ventaPredicha) * 100).toFixed(2) : 0;

            return [`Ventas Reales: ${ventaReal}`, `Predicción: ${ventaPredicha}`, `Porcentaje: ${percentage}%`];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'FECHAS',
          color: '#e2e2e2', // Color del título del eje X
        },
        ticks: {
          color: '#e2e2e2', // Color de los ticks del eje X
        },
      },
      y: {
        title: {
          display: true,
          text: 'VENTAS',
          color: '#e2e2e2', // Color del título del eje Y
        },
        ticks: {
          color: '#e2e2e2', // Color de los ticks del eje Y
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card style={{ padding: '20px', backgroundColor: '#0f1b35', color: '#e2e2e2' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">Comparación de ventas y predicciones del {nombre} de los proximos 30 dias</Typography>
          <IconButton onClick={() => window.location.reload()} style={{ color: '#e2e2e2' }}>
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
                No hay datos disponibles
              </Typography>
            </Box>
          ) : (
            <Line data={demandaFigureData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoComparacionBar;
