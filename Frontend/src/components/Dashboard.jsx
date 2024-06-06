import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export const Dashboard = () => {
  const [productosAgotandose, setProductosAgotandose] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPrediccionAgotamiento = async () => {
      try {
        const response = await axios.post('http://localhost:4000/prediccion/prediccion-ARIMA');
        setProductosAgotandose(response);
        console.log(response)
      } catch (error) {
        setError('Error al obtener la predicción de agotamiento de productos');
      }
    };

    obtenerPrediccionAgotamiento();
  }, []);

  const demandaFigureData = {
    labels: Array.from({ length: 7 }, (_, i) => `Día ${i + 1}`),
    datasets: productosAgotandose.map(producto => ({
      label: producto.nombreProducto,
      data: producto.prediccion ? producto.prediccion.ventas : [],
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      tension: 0.1,
      fill: false
    }))
  };
  
  const stockFigureData = {
    labels: Array.from({ length: 7 }, (_, i) => `Día ${i + 1}`),
    datasets: productosAgotandose.map(producto => ({
      label: producto.nombreProducto,
      data: producto.prediccion ? producto.prediccion.ventas : [],
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      tension: 0.1,
      fill: false
    }))
  };
  
  const productosTortaData = {
    labels: productosAgotandose.map(producto => producto.nombreProducto),
    datasets: [{
      label: 'Stock',
      data: productosAgotandose.map(producto => producto.prediccion ? producto.prediccion.stockRestante >= 0 ? producto.prediccion.stockRestante : 0 : 0),
      backgroundColor: productosAgotandose.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
      hoverOffset: 4
    }]
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <Typography
        variant="h6"
        component="div"
        style={{ marginTop: 0, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: '#03112a', paddingLeft: '235px', paddingRight: '235px' }}
      >
        DASHBOARD
      </Typography>
      {error && <Typography variant="body1" style={{ color: 'red', textAlign: 'center' }}>{error}</Typography>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Demanda de Productos
              </Typography>
              <Line
                data={demandaFigureData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Stock Restante de Productos
              </Typography>
              <Line
                data={stockFigureData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={6} sm={6} md={6} style={{ padding: '10px' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Distribución de Stock Actual
          </Typography>
          <Pie data={productosTortaData} />
        </CardContent>
      </Card>
    </Grid>
    </div>
  );
};
