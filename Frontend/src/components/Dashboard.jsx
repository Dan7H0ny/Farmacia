import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, TextField, InputAdornment, Card, CardContent,  Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Swal from 'sweetalert2';

export const Dashboard = () => {
  const [productosAgotandose, setProductosAgotandose] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filtradodeproductos = productosAgotandose.filter(p =>
    p.nombreProducto.toLowerCase().includes(buscar.toLowerCase())
  );
  const paginatedClientes = filtradodeproductos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const obtenerPrediccionAgotamiento = async () => {
      try {
        const response = await axios.post('http://localhost:4000/prediccion/prediccion-ARIMA');
        setProductosAgotandose(response); // Asegúrate de usar response.data para obtener los datos
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los clientes',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
      }
    };
    obtenerPrediccionAgotamiento();
  }, []);

  const demandaFigureData = {
    labels: Array.from({ length: 7 }, (_, i) => `Día ${i + 1}`),
    datasets: filtradodeproductos.map(producto => ({
      label: producto.nombreProducto,
      data: producto.prediccion ? producto.prediccion.ventas : [],
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      tension: 0.1,
      fill: false
    }))
  };
  
  const productosTortaData = {
    labels: filtradodeproductos.map(producto => producto.nombreProducto),
    datasets: [{
      label: 'Stock',
      data: filtradodeproductos.map(producto => producto.prediccion ? producto.prediccion.stockRestante >= 0 ? producto.prediccion.stockRestante : 0 : 0),
      backgroundColor: filtradodeproductos.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
      hoverOffset: 4
    }]
  };

  return (
    <div id="caja_contenido" style={{ textAlign: 'center',marginLeft:'5%', marginRight: '-5%'}}>
      <Typography variant="h6" component="div" style={{ marginTop: 0, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: '#03112a', paddingLeft: '235px', paddingRight: '235px' }}>
        GRAFICOS PARA LA PREDICCION
      </Typography>
      <Grid item xs={12} sm={12} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
        <TextField
          label="Nombre del producto"
          variant="outlined"
          fullWidth
          size="large"
          type='text'
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          required
          InputProps={{
          sx: { color: '#eeca06' },
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#eeca06' }} />
              </InputAdornment>
              ),
            }}
          InputLabelProps={{ sx: { color: '#eeca06' } }} />
      </Grid>
      <div className="table-responsive">
      <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
        <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Dia de Agotamiento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a",textAlign: 'center' } }}>
          {paginatedClientes.map((x, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
              <TableCell>{x.nombreProducto}</TableCell>
              <TableCell>{x.diaAgotamiento ? x.diaAgotamiento : 'Este producto no se agotara'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid item xs={12} sm={4} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
        <TablePagination
          component="div"
          count={filtradodeproductos.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por por pagina"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[5, 10, 15, 20]}
          sx={{ 
            '& .MuiTablePagination-toolbar': {
              backgroundColor: "#03112a",
              color: '#eeca06',
              display: 'flex',
              justifyContent: 'center', // Centra el contenido dentro de la toolbar
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#eeca06',
              margin: '0 1%', // Ajusta el margen para centrar
            },
            '& .MuiTablePagination-input': {
              color: '#eeca06',
              margin: '0 1%', // Ajusta el margen para centrar
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#eeca06',
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#eeca06',
              margin: '0 1%', // Ajusta el margen para centrar
            },
            '& .MuiTablePagination-actions': {
              color: '#eeca06',
            }
          }}
        />
      </Grid>
    </div>
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
        <Grid item xs={12} md={6} style={{ padding: '10px' }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Distribución de Stock Actual
            </Typography>
            <Pie data={productosTortaData} />
          </CardContent>
        </Card>
      </Grid>
      </Grid>
    </div>
  );
};
