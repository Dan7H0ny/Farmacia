import React, { useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const InfoMeses = () => {
  const [mes, setMes] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const SeleccionarMes = async () => {
    if (!mes) {
      alert('Por favor, seleccione un mes.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${UrlReact}/prediccion/mostrar/meses`, { mes: meses.indexOf(mes) + 1 });
      setResultados(response);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      alert('Ocurrió un error al obtener los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius: '15px', padding: '20px', backgroundColor: '#0f1b35', border: '2px solid #e2e2e2', color: '#e2e2e2' }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" gutterBottom>
          SELECCIONE EL MES QUE DESEE VER
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Select
              fullWidth
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
              }}
            >
              <MenuItem value="" disabled>Seleccionar mes</MenuItem>
              {meses.map((mes, index) => (
                <MenuItem key={index} value={mes}>{mes}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={SeleccionarMes}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                },
              }}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Aceptar'}
            </Button>
          </Grid>
        </Grid>
        {resultados.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" component="div" align="center" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
              <TableHead className="text-center" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2' } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad Vendida</TableCell>
                  <TableCell>Promedio de Ventas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
                {resultados.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>{producto.totalVentas.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoMeses;